import { cva } from "class-variance-authority";

/**
 * Size container for the tile — the internal layout reacts to the tile's own
 * width, never the viewport. Applied to a wrapper so the container-query
 * variants inside can match it.
 */
export const featureTileVariants = cva("@container h-full");

/**
 * Header block. In narrow tiles (below 16rem of container width) the icon
 * tile sits inline with the title; from 16rem the header stacks — icon tile
 * above, title below.
 */
export const featureTileHeaderVariants = cva(
  "flex items-center gap-3 @[16rem]:flex-col @[16rem]:items-start @[16rem]:gap-4",
);
