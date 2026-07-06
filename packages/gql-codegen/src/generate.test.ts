import { describe, expect, it } from "vitest";
import { generateFromSdl } from "./generate";

// One fixture exercising every extension over the naive CRUD generator:
// Boolean fields (checkbox), Money fields (currency + nested selection),
// nested object selections with a reference cycle, list inputs (form skipped,
// operations kept), JSON fields, optional nested input objects (omitted from
// the form, kept in Zod), update/delete operations, and `extend type Query`.
const fixtureSdl = /* GraphQL */ `
  directive @widget(type: FormWidget!) on INPUT_FIELD_DEFINITION | FIELD_DEFINITION
  directive @display(label: String, tone: String) on ENUM_VALUE
  directive @detail(hidden: Boolean = false) on FIELD_DEFINITION
  directive @min(value: Float!) on INPUT_FIELD_DEFINITION | FIELD_DEFINITION
  directive @minLength(value: Int!) on INPUT_FIELD_DEFINITION | FIELD_DEFINITION
  directive @label(value: String!) on INPUT_FIELD_DEFINITION | FIELD_DEFINITION
  directive @detailView on OBJECT

  enum FormWidget {
    text
    password
    textarea
    number
    currency
    email
    phone
    date
    select
    radio
    checkbox
    switch
  }

  scalar JSON
  scalar CurrencyCode

  type Money {
    amount: Float!
    currency: CurrencyCode!
  }

  enum ProjectStatus {
    active @display(label: "Active", tone: "success")
    onLeave @display(tone: "warning")
  }

  type Department {
    id: ID!
    name: String!
    head: Project
  }

  type Project {
    id: ID!
    firstName: String! @minLength(value: 2)
    email: String! @widget(type: email)
    isManager: Boolean!
    budget: Money!
    status: ProjectStatus!
    department: Department
    tags: [String!]!
    metadata: JSON
    secret: String! @detail(hidden: true)
  }

  input AddressInput {
    city: String!
  }

  input CreateProjectInput {
    firstName: String! @minLength(value: 2)
    email: String! @widget(type: email)
    isManager: Boolean!
    budgetAmount: Float! @widget(type: currency) @min(value: 0)
    status: ProjectStatus!
    address: AddressInput
  }

  input UpdateProjectInput {
    firstName: String
    isManager: Boolean
  }

  input TransferProjectInput {
    newDepartment: String! @label(value: "Department")
    status: ProjectStatus!
    reason: String @widget(type: textarea)
    effectiveDate: String! @widget(type: date)
  }

  input CreateDepartmentInput {
    name: String!
    tags: [String!]!
  }

  type Stats {
    total: Int!
    totalCost: Money!
    topProject: Project
  }

  # A read-only projection: no Create/Update input, so not an entity, but marked
  # for detail-schema generation. Its query stays non-null (see below).
  type CompanyProfile @detailView {
    id: ID!
    legalName: String! @label(value: "Legal name")
    status: ProjectStatus!
    logo: Department
    secret: String! @detail(hidden: true)
  }

  # Named like the generated document const for "query Project" on purpose —
  # the namespace types import must keep them from colliding.
  type ProjectDocument {
    id: ID!
    fileName: String!
  }

  type Query {
    projects(status: ProjectStatus): [Project!]!
    project(id: ID!): Project
    departments: [Department!]!
    stats: Stats!
    companyProfile: CompanyProfile!
    version: String!
    formConfig: JSON
    projectDocuments: [ProjectDocument!]!
    _health: Boolean!
  }

  extend type Query {
    extension: Boolean
  }

  type Mutation {
    createProject(input: CreateProjectInput!): Project!
    updateProject(id: ID!, input: UpdateProjectInput!): Project!
    deleteProject(id: ID!): Boolean!
    createDepartment(input: CreateDepartmentInput!): Department!
    promoteProject(id: ID!): Project!
    transferProject(id: ID!, input: TransferProjectInput!): Project!
    archiveProjects(ids: [ID!]!): Boolean!
  }
`;

const { files, diagnostics } = generateFromSdl(fixtureSdl);

describe("generateFromSdl", () => {
  it("produces no error diagnostics — every generated operation validates against the schema", () => {
    expect(diagnostics.filter((d) => d.severity === "error")).toEqual([]);
  });

  it("renders Boolean entity fields as checkbox and Money fields as currency", () => {
    expect(files.domainDefinitions).toContain('name: "isManager"');
    expect(files.domainDefinitions).toContain('scalar: "Boolean"');
    expect(files.domainDefinitions).toContain('widget: "checkbox"');
    expect(files.domainDefinitions).toContain('scalar: "Money"');
    expect(files.domainDefinitions).toContain('widget: "currency"');
  });

  it("drops non-renderable kinds from the detail view but keeps @detail(hidden) out too", () => {
    const projectEntity = files.domainDefinitions.slice(
      files.domainDefinitions.indexOf("projectEntityDefinition"),
      files.domainDefinitions.indexOf("projectCreateDefinition"),
    );
    for (const excluded of ['"department"', '"tags"', '"metadata"', '"secret"']) {
      expect(projectEntity).not.toContain(`name: ${excluded}`);
    }
    expect(diagnostics).toContainEqual(
      expect.objectContaining({ where: "Project.tags", severity: "info" }),
    );
  });

  it("nests object selections (Money included) and guards reference cycles", () => {
    expect(files.operations).toMatch(/budget \{\n\s+amount\n\s+currency\n\s+\}/);
    expect(files.operations).toMatch(/department \{\n\s+id\n\s+name\n\s+\}/);
    expect(diagnostics).toContainEqual(
      expect.objectContaining({ where: "Department.head", severity: "info" }),
    );
  });

  it("emits list, one, create, update, and delete documents", () => {
    for (const doc of [
      "ProjectsDocument",
      "ProjectDocument",
      "CreateProjectDocument",
      "UpdateProjectDocument",
      "DeleteProjectDocument",
      "CreateDepartmentDocument",
    ]) {
      expect(files.operations).toContain(`export const ${doc}`);
    }
    expect(files.operations).toContain(
      "TypedDocumentNode<{ deleteProject: boolean }, { id: string }>",
    );
    expect(files.operations).toContain(
      "TypedDocumentNode<{ updateProject: Types.Project }, { id: string; input: Types.UpdateProjectInput }>",
    );
  });

  it("skips the form for an input with a required unsupported field, keeping its operations", () => {
    expect(files.forms).not.toContain("createDepartmentFormSchema");
    expect(files.operations).toContain("CreateDepartmentDocument");
    expect(diagnostics).toContainEqual(
      expect.objectContaining({ where: "CreateDepartmentInput.tags", severity: "warning" }),
    );
  });

  it("omits an optional unsupported input field from the form but keeps it in Zod", () => {
    const createDef = files.domainDefinitions.slice(
      files.domainDefinitions.indexOf("projectCreateDefinition"),
      files.domainDefinitions.indexOf("projectUpdateDefinition"),
    );
    expect(createDef).not.toContain('name: "address"');
    expect(files.inputSchemas).toContain("address: addressInputSchema.optional()");
    expect(files.inputSchemas.indexOf("addressInputSchema")).toBeLessThan(
      files.inputSchemas.indexOf("createProjectInputSchema"),
    );
  });

  it("generates the update form path (definition, form schema, Zod)", () => {
    expect(files.domainDefinitions).toContain("projectUpdateDefinition");
    expect(files.forms).toContain(
      "export function updateProjectFormSchema(): TypedRegistrationSchema<UpdateProjectInput>",
    );
    expect(files.inputSchemas).toContain("export const updateProjectInputSchema");
    expect(files.inputSchemas).toContain("isManager: z.boolean().optional()");
  });

  it("derives directive-aware Zod for the create input", () => {
    expect(files.inputSchemas).toContain("firstName: z.string().min(2)");
    expect(files.inputSchemas).toContain("email: z.string().email()");
    expect(files.inputSchemas).toContain("isManager: z.boolean()");
    expect(files.inputSchemas).toContain("budgetAmount: z.number().min(0)");
    expect(files.inputSchemas).toContain("status: projectStatusSchema");
    expect(files.inputSchemas).toContain("tags: z.array(z.string())");
  });

  it("emits enum display metadata with humanized fallbacks and Badge tones", () => {
    expect(files.enums).toContain('active: { label: "Active", tone: "success" }');
    expect(files.enums).toContain('onLeave: { label: "On leave", tone: "warning" }');
    expect(files.enums).toContain("export const projectStatusOptions: DynamicFieldOption[]");
    expect(files.enums).toContain(
      "satisfies Record<ProjectStatus, { label: string; tone: BadgeTone }>",
    );
  });

  it("emits documents for custom root fields — aggregates, leaves, and custom mutations", () => {
    // Singleton aggregate with a nested selection (Money + entity sub-object).
    expect(files.operations).toContain(
      "export const StatsDocument: TypedDocumentNode<{ stats: Types.Stats }, Record<string, never>>",
    );
    expect(files.operations).toMatch(/query Stats \{\n\s+stats \{\n\s+total\n\s+totalCost \{/);
    // Leaf returns: scalar, JSON (unknown), and a nullable Boolean from extend type Query.
    expect(files.operations).toContain(
      "export const VersionDocument: TypedDocumentNode<{ version: string }, Record<string, never>>",
    );
    expect(files.operations).toContain(
      "export const FormConfigDocument: TypedDocumentNode<{ formConfig: unknown | null }, Record<string, never>>",
    );
    expect(files.operations).toContain(
      "export const ExtensionDocument: TypedDocumentNode<{ extension: boolean | null }, Record<string, never>>",
    );
    // Custom mutations reuse the entity selection / take list args.
    expect(files.operations).toContain(
      "export const PromoteProjectDocument: TypedDocumentNode<{ promoteProject: Types.Project }, { id: string }>",
    );
    expect(files.operations).toContain(
      "export const ArchiveProjectsDocument: TypedDocumentNode<{ archiveProjects: boolean }, { ids: string[] }>",
    );
  });

  it("generates a form for a custom mutation's input-object argument", () => {
    // Definition, form schema, and Zod all emitted from TransferProjectInput.
    expect(files.domainDefinitions).toContain(
      "satisfies CreateInputDefinition<TransferProjectInput>",
    );
    expect(files.domainDefinitions).toContain("export const transferProjectDefinition");
    expect(files.forms).toContain(
      "export function transferProjectFormSchema(): TypedRegistrationSchema<TransferProjectInput>",
    );
    expect(files.inputSchemas).toContain("export const transferProjectInputSchema");
    // Field directives carry through: custom label, textarea, date, enum select.
    const def = files.domainDefinitions.slice(
      files.domainDefinitions.indexOf("transferProjectDefinition"),
    );
    expect(def).toContain('label: "Department"');
    expect(def).toContain('widget: "textarea"');
    expect(def).toContain('widget: "date"');
    // The enum field pulls its options import into the form.
    expect(files.forms).toContain("projectStatusOptions");
    // The mutation still gets its document too (form and operation coexist).
    expect(files.operations).toContain("export const TransferProjectDocument");
  });

  it("emits no action form for a custom mutation with no input-object argument", () => {
    expect(files.forms).not.toContain("promoteProjectFormSchema");
    expect(files.domainDefinitions).not.toContain("promoteProjectDefinition");
  });

  it("generates a detail schema for a @detailView type without an input", () => {
    expect(files.domainDefinitions).toContain("satisfies EntityDefinition<CompanyProfile>");
    expect(files.domainDefinitions).toContain("export const companyProfileEntityDefinition");
    expect(files.forms).toContain(
      "export function companyProfileDetailSchema(): TypedDetailSchema<CompanyProfile>",
    );
    // Field directives carry through; id, @detail(hidden), and unsupported kinds drop.
    const def = files.domainDefinitions.slice(
      files.domainDefinitions.indexOf("companyProfileEntityDefinition"),
    );
    expect(def).toContain('label: "Legal name"');
    for (const excluded of ['"id"', '"secret"', '"logo"']) {
      expect(def.slice(0, def.indexOf("EntityDefinition<CompanyProfile>"))).not.toContain(
        `name: ${excluded}`,
      );
    }
    // The enum field pulls its options into the detail schema.
    expect(files.forms).toContain("projectStatusOptions");
  });

  it("leaves a @detailView type's query as a custom operation with intact nullability", () => {
    // Not entity-fied: the non-null `companyProfile: CompanyProfile!` stays
    // non-null (an entity's oneField would be forced to `| null`).
    expect(files.operations).toContain(
      "export const CompanyProfileDocument: TypedDocumentNode<{ companyProfile: Types.CompanyProfile }, Record<string, never>>",
    );
    expect(files.domainDefinitions).not.toContain("companyProfileCreateDefinition");
  });

  it("imports base types as a namespace so document consts can't collide with type names", () => {
    expect(files.operations).toContain('import type * as Types from "./types";');
    // `type ProjectDocument` (schema) and `ProjectDocument` (const for
    // `query Project`) coexist: the type is only ever `Types.ProjectDocument`.
    expect(files.operations).toContain(
      "export const ProjectDocumentsDocument: TypedDocumentNode<{ projectDocuments: Types.ProjectDocument[] }, Record<string, never>>",
    );
    expect(files.operations).toContain(
      "export const ProjectDocument: TypedDocumentNode<{ project: Types.Project | null }, { id: string }>",
    );
  });

  it("types nullable root-field args as optional variables", () => {
    expect(files.operations).toContain(
      "TypedDocumentNode<{ projects: Types.Project[] }, { status?: Types.ProjectStatus | null }>",
    );
    expect(files.operations).toContain("query Projects($status: ProjectStatus)");
  });

  it("skips underscore-prefixed root fields with an info diagnostic", () => {
    expect(files.operations).not.toContain("_health");
    expect(diagnostics).toContainEqual(
      expect.objectContaining({ where: "Query._health", severity: "info" }),
    );
  });

  it("keeps the full definition + registry for entities with a supported create form", () => {
    expect(files.domainDefinitions).toContain(
      "satisfies DomainDefinition<Project, CreateProjectInput>",
    );
    expect(files.domainDefinitions).toContain("project: projectDefinition,");
    // Department has no supported create form → no full definition for it.
    expect(files.domainDefinitions).not.toContain("departmentDefinition");
  });

  it("errors when a Query and a Mutation root field would produce the same document name", () => {
    const collisionSdl = /* GraphQL */ `
      type Widget {
        id: ID!
        name: String!
      }

      type Query {
        sync: Widget
      }

      type Mutation {
        sync: Widget!
      }
    `;
    const result = generateFromSdl(collisionSdl);
    expect(result.diagnostics).toContainEqual(
      expect.objectContaining({ where: "Mutation.sync", severity: "error" }),
    );
    expect(result.files.operations.match(/export const SyncDocument/g)).toHaveLength(1);
  });
});
