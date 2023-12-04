interface ArrowProps {
  down?: boolean;
}

const Arrow = ({ down }: ArrowProps) => {
  return down ? (
    <svg
      transform="rotate(90)"
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="11"
      viewBox="0 0 16 11"
      fill="none"
    >
      <path
        d="M10.6667 1C10.6667 1.477 11.1553 2.18929 11.65 2.78714C12.286 3.55857 13.046 4.23164 13.9173 4.74529C14.5707 5.13036 15.3627 5.5 16 5.5M16 5.5C15.3627 5.5 14.57 5.86964 13.9173 6.25471C13.046 6.769 12.286 7.44207 11.65 8.21221C11.1553 8.81071 10.6667 9.52429 10.6667 10M16 5.5L-6.73538e-07 5.5"
        stroke="white"
        strokeWidth="2"
      />
    </svg>
  ) : (
    // Arrow no rotation
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="11"
      viewBox="0 0 16 11"
      fill="none"
    >
      <path
        d="M10.6667 1C10.6667 1.477 11.1553 2.18929 11.65 2.78714C12.286 3.55857 13.046 4.23164 13.9173 4.74529C14.5707 5.13036 15.3627 5.5 16 5.5M16 5.5C15.3627 5.5 14.57 5.86964 13.9173 6.25471C13.046 6.769 12.286 7.44207 11.65 8.21221C11.1553 8.81071 10.6667 9.52429 10.6667 10M16 5.5L-6.73538e-07 5.5"
        stroke="white"
        strokeWidth="2"
      />
    </svg>
  );
};

export default Arrow;
