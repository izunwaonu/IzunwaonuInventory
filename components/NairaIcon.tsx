// components/NairaIcon.tsx
const NairaIcon = ({
    size = 24,
    color = 'currentColor',
    ...props
  }: React.SVGProps<SVGSVGElement> & { size?: number; color?: string }) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <text
        x="4"
        y="18"
        fontSize="16"
        fontWeight= {300}
        fontFamily="Arial, sans-serif"
        fill={color}
      >
        ₦
      </text>
    </svg>
  );
  
  export default NairaIcon;
  