/**
 * Content present for assistive technology and absent from the visual
 * layout — an icon-only button's real label, an SR-only column header.
 *
 * Not `display: none` or `hidden`: both remove a node from the accessibility
 * tree as completely as from the screen, which is the opposite of the point.
 */
export function VisuallyHidden({
  children,
  as: As = "span",
}: {
  children: React.ReactNode;
  as?: React.ElementType;
}) {
  return (
    <As
      style={{
        position: "absolute",
        width: 1,
        height: 1,
        margin: -1,
        padding: 0,
        border: 0,
        overflow: "hidden",
        clip: "rect(0 0 0 0)",
        clipPath: "inset(50%)",
        whiteSpace: "nowrap",
      }}
    >
      {children}
    </As>
  );
}
