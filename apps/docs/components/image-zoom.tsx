"use client";

import Image from "next/image";
import type { ImageProps } from "next/image";
import type { ImgHTMLAttributes } from "react";
import "./image-zoom.css";
import Zoom from "react-medium-image-zoom";
import type { UncontrolledProps } from "react-medium-image-zoom";

export type ImageZoomProps = ImageProps & {
  /**
   * Image props when zoom in
   */
  zoomInProps?: ImgHTMLAttributes<HTMLImageElement>;

  /**
   * Props for `react-medium-image-zoom`
   */
  rmiz?: UncontrolledProps;
};

function getImageSrc(src: ImageProps["src"]): string {
  if (typeof src === "string") return src;
  if ("default" in src) return src.default.src;
  return src.src;
}

export function ImageZoom({
  zoomInProps,
  children,
  rmiz,
  ...props
}: ImageZoomProps): React.ReactElement {
  return (
    <Zoom
      zoomMargin={20}
      wrapElement="span"
      {...rmiz}
      zoomImg={{
        src: getImageSrc(props.src),
        sizes: undefined,
        ...zoomInProps,
      }}
    >
      {children ?? (
        <Image
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 70vw, 900px"
          {...props}
        />
      )}
    </Zoom>
  );
}
