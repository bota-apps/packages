import * as React from "react";
import {
  TableScrollContainerEl,
  TableEl,
  TheadEl,
  TbodyEl,
  TfootEl,
  TrEl,
  ThEl,
  TdEl,
  CaptionEl,
  type ThElProps,
  type TdElProps,
} from "../html";

export * from "./variants";

const Table = React.forwardRef<HTMLTableElement, React.HTMLAttributes<HTMLTableElement>>(
  (props, ref) => (
    <TableScrollContainerEl>
      <TableEl ref={ref} {...props} />
    </TableScrollContainerEl>
  ),
);
Table.displayName = "Table";

const TableHeader = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>((props, ref) => <TheadEl ref={ref} {...props} />);
TableHeader.displayName = "TableHeader";

const TableBody = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>((props, ref) => <TbodyEl ref={ref} {...props} />);
TableBody.displayName = "TableBody";

const TableFooter = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>((props, ref) => <TfootEl ref={ref} {...props} />);
TableFooter.displayName = "TableFooter";

const TableRow = React.forwardRef<HTMLTableRowElement, React.HTMLAttributes<HTMLTableRowElement>>(
  (props, ref) => <TrEl ref={ref} {...props} />,
);
TableRow.displayName = "TableRow";

const TableHead = React.forwardRef<HTMLTableCellElement, ThElProps>((props, ref) => (
  <ThEl ref={ref} {...props} />
));
TableHead.displayName = "TableHead";

const TableCell = React.forwardRef<HTMLTableCellElement, TdElProps>((props, ref) => (
  <TdEl ref={ref} {...props} />
));
TableCell.displayName = "TableCell";

const TableCaption = React.forwardRef<
  HTMLTableCaptionElement,
  React.HTMLAttributes<HTMLTableCaptionElement>
>((props, ref) => <CaptionEl ref={ref} {...props} />);
TableCaption.displayName = "TableCaption";

export { Table, TableHeader, TableBody, TableFooter, TableHead, TableRow, TableCell, TableCaption };
