declare module "cloudinary-react" {
  import { Component, ReactNode } from "react";

  interface CloudinaryContextProps {
    cloudName: string;
    children: ReactNode;
  }

  export class CloudinaryContext extends Component<CloudinaryContextProps> {}

  interface VideoProps {
    publicId: string;
    width?: string | number;
    height?: string | number;
    controls?: boolean;
    className?: string;
    [key: string]: any;
  }

  export class Video extends Component<VideoProps> {}

  // Add other components as needed (Image, Transformation, etc.)
}
