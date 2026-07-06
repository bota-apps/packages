import type { GraphQLClient } from "@bota-apps/gql-client";
import type { TypedDocumentNode } from "@graphql-typed-document-node/core";
import type {
  QueryKey,
  UseMutationOptions,
  UseMutationResult,
  UseQueryOptions,
  UseQueryResult,
  UseSuspenseQueryOptions,
  UseSuspenseQueryResult,
} from "@tanstack/react-query";
import { Kind, print, type DocumentNode, type OperationDefinitionNode } from "graphql";
import { useGraphQLClient } from "./graphqlContext";
import { useMutationPipeline } from "./useMutationPipeline";
import { useQueryPipeline, useSuspenseQueryPipeline } from "./useQueryPipeline";

/**
 * Document-generic GraphQL hooks. The document IS the operation: no per-domain
 * hook modules. A document must select exactly one root field, and `data` is
 * that field's value directly (`Department[]`, `Department | null`, …) — no
 * response envelope to peel at every call site. Beyond the unwrap, nothing is
 * synthesized: a nullable field reaches the consumer as `null`, and errors are
 * the query/mutation error.
 */

export type GqlVariables = Record<string, unknown>;

/**
 * When the document has no required variables (none at all, or all optional),
 * the variables argument may be omitted; otherwise it is mandatory.
 */
type VarsArgs<TVars, TOptions> =
  Record<string, never> extends TVars
    ? [variables?: TVars, options?: TOptions]
    : [variables: TVars, options?: TOptions];

// print() walks the whole AST — cache per document since documents are
// module-level constants. Keyed on DocumentNode: TypedDocumentNode's phantom
// __apiType is contravariant, so a TypedDocumentNode<unknown, unknown> key
// type would reject concrete documents.
const printedDocuments = new WeakMap<DocumentNode, string>();

function documentText(document: DocumentNode): string {
  let text = printedDocuments.get(document);
  if (text === undefined) {
    text = print(document);
    printedDocuments.set(document, text);
  }
  return text;
}

function operationDefinition(document: DocumentNode): OperationDefinitionNode | undefined {
  for (const definition of document.definitions) {
    if (definition.kind === Kind.OPERATION_DEFINITION) {
      return definition;
    }
  }
  return undefined;
}

function operationName(document: DocumentNode): string {
  const name = operationDefinition(document)?.name?.value;
  if (name === undefined) {
    throw new Error("GraphQL document must contain a named operation to derive a query key");
  }
  return name;
}

// The unwrap contract: exactly one root field, checked once per document.
const singleFieldDocuments = new WeakSet<DocumentNode>();

function assertSingleRootField(document: DocumentNode): void {
  if (singleFieldDocuments.has(document)) {
    return;
  }
  const selections = operationDefinition(document)?.selectionSet.selections ?? [];
  if (selections.length !== 1) {
    throw new Error(
      `GraphQL document ${operationName(document)} must select exactly one root field ` +
        `(found ${selections.length}) — the hooks return that field's value directly.`,
    );
  }
  singleFieldDocuments.add(document);
}

/**
 * Canonical query key for a document: `[operationName]` or
 * `[operationName, variables]`. `undefined`-valued variables are stripped and
 * an empty variables object collapses to `[operationName]`, so the no-vars
 * form is a prefix of every vars variant — `invalidateQueries({ queryKey:
 * gqlQueryKey(DepartmentDocument) })` matches all cached ids.
 */
export function gqlQueryKey<TData, TVars extends GqlVariables>(
  document: TypedDocumentNode<TData, TVars>,
  variables?: TVars,
): QueryKey {
  const name = operationName(document);
  if (variables === undefined) {
    return [name];
  }
  const defined = Object.entries(variables).filter(([, value]) => value !== undefined);
  if (defined.length === 0) {
    return [name];
  }
  return [name, Object.fromEntries(defined)];
}

// graphql-request v7's `request` takes a conditional-tuple rest parameter,
// which an unresolved TVars can't be assigned to; `rawRequest` takes a plain
// optional `variables?` — the zero-cast path for a generic wrapper. GraphQL
// errors reject as ClientError and surface as the query/mutation error.
async function requestField<TField extends string, TResult, TVars extends GqlVariables>(
  client: GraphQLClient,
  document: TypedDocumentNode<Record<TField, TResult>, TVars>,
  variables: TVars | undefined,
): Promise<TResult> {
  assertSingleRootField(document);
  const response = await client.rawRequest<Record<TField, TResult>, TVars>(
    documentText(document),
    variables,
  );
  // Exactly one root field (asserted above), so the sole value is TResult.
  // JSON can't carry undefined — an empty response object is a broken server.
  const [value] = Object.values<TResult>(response.data);
  if (value === undefined) {
    throw new Error(`GraphQL response for ${operationName(document)} contained no root field`);
  }
  return value;
}

export type GqlQueryOptions<TResult> = Omit<
  UseQueryOptions<TResult, Error, TResult, QueryKey>,
  "queryKey" | "queryFn"
>;

export type GqlSuspenseQueryOptions<TResult> = Omit<
  UseSuspenseQueryOptions<TResult, Error, TResult, QueryKey>,
  "queryKey" | "queryFn"
>;

export type GqlMutationOptions<TResult, TVars> = Omit<
  UseMutationOptions<TResult, Error, TVars, unknown>,
  "mutationFn" | "mutationKey"
> & {
  /** Query keys to invalidate on success — shorthand for `meta.invalidates`. */
  invalidates?: QueryKey[];
};

export function useGqlQuery<TField extends string, TResult, TVars extends GqlVariables>(
  document: TypedDocumentNode<Record<TField, TResult>, TVars>,
  ...args: VarsArgs<TVars, GqlQueryOptions<TResult>>
): UseQueryResult<TResult, Error> {
  const client = useGraphQLClient();
  const [variables, options] = args;
  return useQueryPipeline<TResult>({
    ...options,
    queryKey: gqlQueryKey(document, variables),
    queryFn: () => requestField(client, document, variables),
  });
}

export function useGqlSuspenseQuery<TField extends string, TResult, TVars extends GqlVariables>(
  document: TypedDocumentNode<Record<TField, TResult>, TVars>,
  ...args: VarsArgs<TVars, GqlSuspenseQueryOptions<TResult>>
): UseSuspenseQueryResult<TResult, Error> {
  const client = useGraphQLClient();
  const [variables, options] = args;
  return useSuspenseQueryPipeline<TResult>({
    ...options,
    queryKey: gqlQueryKey(document, variables),
    queryFn: () => requestField(client, document, variables),
  });
}

export function useGqlMutation<TField extends string, TResult, TVars extends GqlVariables>(
  document: TypedDocumentNode<Record<TField, TResult>, TVars>,
  options?: GqlMutationOptions<TResult, TVars>,
): UseMutationResult<TResult, Error, TVars> {
  const client = useGraphQLClient();
  const { invalidates, meta, ...rest } = options ?? {};
  return useMutationPipeline<TResult, Error, TVars>({
    ...rest,
    mutationFn: (variables) => requestField(client, document, variables),
    meta: invalidates ? { ...meta, invalidates } : meta,
  });
}
