// /** @type {import('tailwindcss').Config} */
// export default {
//   content: [],
//   theme: {
//     extend: {},
//   },
//   plugins: [],
// }

export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "rabbit-red": "#ea2e0e",
        ft: "#05472a",
      },
    },
  },
  plugins: [],
};

// /** @type {import('tailwindcss').Config} */
// module.exports = {
//   darkMode: "class",
//   content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
//   theme: {
//     extend: {
//       colors: {},
//       keyframes: {
//         fadeInUp: {
//           "0%": {
//             opacity: "0",
//             transform: "translateY(60px)",
//           },
//           "100%": {
//             opacity: "1",
//             transform: "translateY(0)",
//           },
//         },
//       },
//       animation: {
//         // fadeInUp: "fadeInUp 1.8s ease-out forwards",
//         fadeInUp: "fadeInUp 0.8s ease-out both 0.3s",
//       },
//     },
//   },
//   plugins: [],
// };
