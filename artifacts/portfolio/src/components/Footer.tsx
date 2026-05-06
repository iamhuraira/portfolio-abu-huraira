import data from "@/data/portfolio.json";

export default function Footer() {
  return (
    <footer
      className="border-t border-white/5 py-8 px-4 text-center"
      data-testid="footer"
    >
      <p className="text-gray-600 text-xs">
        © {new Date().getFullYear()} {data.brand} — Built with React & GSAP
      </p>
    </footer>
  );
}
