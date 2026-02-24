// export default {
//   darkMode: "class",
//   content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
//   theme: {
//     extend: {
//       colors: {
//         "rabbit-red": "#ea2e0e",
//         ft: "#05472a",
//       },
//     },
//   },
//   plugins: [],
// };
// //  buttonPrimary: "#14532d",
// //         "bg-dark": "#1a202c",

//test
// tailwind.config.js
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "rabbit-red": "#ea2e0e",
        ft: "#05472a", // xanh lá chủ đạo
      },
      keyframes: {
        eclipseRotate: {
          // tên mới để tránh trùng
          "0%": { transform: "rotate(0deg)" },
          "50%": { transform: "rotate(180deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
      },
      animation: {
        eclipseRotate: "eclipseRotate 1s linear infinite", // tốc độ giống gốc
      },
    },
  },
  plugins: [],
};
