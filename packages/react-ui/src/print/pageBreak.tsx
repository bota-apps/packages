/** Forces a page break before this element when printing. */
export function PageBreak() {
  return <div className="print:break-before-page" aria-hidden="true" />;
}
