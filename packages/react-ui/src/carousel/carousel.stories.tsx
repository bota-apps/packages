import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "../button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../dialog";
import { Img } from "../html/img";
import { Carousel, carouselImageVariants } from "./index";

function placeholderImage(label: string, background: string): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="500"><rect width="800" height="500" fill="${background}"/><circle cx="290" cy="210" r="60" fill="white" opacity="0.7"/><rect x="180" y="320" width="440" height="28" rx="14" fill="white" opacity="0.7"/><text x="400" y="120" font-family="sans-serif" font-size="36" fill="white" text-anchor="middle">${label}</text></svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

const slides = [
  { id: "one", label: "Attachment 1", src: placeholderImage("Attachment 1", "#64748b") },
  { id: "two", label: "Attachment 2", src: placeholderImage("Attachment 2", "#0d9488") },
  { id: "three", label: "Attachment 3", src: placeholderImage("Attachment 3", "#7c3aed") },
];

const meta: Meta<typeof Carousel> = {
  title: "Display/Carousel",
  component: Carousel,
};
export default meta;

type Story = StoryObj<typeof Carousel>;

export const Default: Story = {
  render: () => (
    <Carousel label="Attachments">
      {slides.map((slide) => (
        <Img key={slide.id} src={slide.src} alt={slide.label} className={carouselImageVariants()} />
      ))}
    </Carousel>
  ),
};

export const SingleSlide: Story = {
  render: () => (
    <Carousel label="Attachments">
      <Img src={slides[0].src} alt={slides[0].label} className={carouselImageVariants()} />
    </Carousel>
  ),
};

export const CompactStage: Story = {
  render: () => (
    <Carousel label="Attachments" stageSize="sm">
      {slides.map((slide) => (
        <Img key={slide.id} src={slide.src} alt={slide.label} className={carouselImageVariants()} />
      ))}
    </Carousel>
  ),
};

/**
 * Staged inside a modal dialog: `arrowKeys="document"` keeps arrow-key paging
 * alive while focus sits on dialog chrome outside the carousel.
 */
export const InDialog: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Preview attachments</Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl" aria-describedby={undefined}>
        <DialogHeader>
          <DialogTitle>Attachments</DialogTitle>
        </DialogHeader>
        <Carousel label="Attachments" arrowKeys="document">
          {slides.map((slide) => (
            <Img
              key={slide.id}
              src={slide.src}
              alt={slide.label}
              className={carouselImageVariants()}
            />
          ))}
        </Carousel>
      </DialogContent>
    </Dialog>
  ),
};

export const LocalizedLabels: Story = {
  render: () => (
    <Carousel
      label="ማያያዣዎች"
      previousLabel="ቀዳሚ"
      nextLabel="ቀጣይ"
      positionLabel={(position, total) => `${position} ከ ${total}`}
    >
      {slides.map((slide) => (
        <Img key={slide.id} src={slide.src} alt={slide.label} className={carouselImageVariants()} />
      ))}
    </Carousel>
  ),
};
