import PlaceholderImg from "../../../assets/Images/imagePlaceholder.png";

export default function ProductImage({ imageUrl, name, ...props }) {
  return (
    <img
      src={imageUrl || PlaceholderImg}
      alt={name}
      className="w-12 h-12 rounded object-cover border"
      {...props}
    />
  );
}
