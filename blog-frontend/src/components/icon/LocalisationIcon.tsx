import "./UserCheckIcon.css";
export const LocalisationIcon = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 60 60"
      className="icon"
    >
      <path
        d="M30 6C20 6 14 14 14 22C14 32 30 54 30 54C30 54 46 32 46 22C46 14 40 6 30 6Z"
        fill="var(--icon-primary)"
        opacity="0.2"
      />

      <circle cx="30" cy="22" r="6" fill="var(--icon-primary)" />

      <circle
        cx="30"
        cy="22"
        r="10"
        stroke="var(--icon-accent)"
        stroke-width="2"
        fill="none"
      />
    </svg>
  );
};
