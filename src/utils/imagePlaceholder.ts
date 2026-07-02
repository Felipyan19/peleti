/**
 * LQIP genérico para next/image: un rectángulo turquesa pálido difuminado
 * acorde a la marca, mostrado mientras carga la imagen real.
 */
const svg =
  "<svg xmlns='http://www.w3.org/2000/svg' width='8' height='10'>" +
  "<filter id='b'><feGaussianBlur stdDeviation='1.5'/></filter>" +
  "<rect width='8' height='10' fill='#bfe9ea' filter='url(#b)'/>" +
  "</svg>";

export const BLUR_DATA_URL = `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
