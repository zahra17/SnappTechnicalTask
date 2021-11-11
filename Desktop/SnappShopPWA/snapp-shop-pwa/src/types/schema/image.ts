export interface Image {
  imageId: number | null
  imageSrc: string
  imageThumbnailSrc: string
  imageUserType: string | null
  imageDescription: string | null
  main: string
  thumb: string | undefined
}
