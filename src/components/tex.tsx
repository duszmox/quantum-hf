import katex from "katex";
import { useMemo } from "react";

export interface TexProps {
  children: string;
  className?: string;
}

export default function Tex({ children, className }: TexProps) {
  const html = useMemo(
    () => katex.renderToString(children, { throwOnError: false }),
    [children],
  );

  return (
    <span className={className} dangerouslySetInnerHTML={{ __html: html }} />
  );
}
