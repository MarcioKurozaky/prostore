export const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME || "Prostore";

export const APP_DESCRIPTION =
  process.env.NEXT_PUBLIC_APP_DESCRIPTION ||
  "A modern store built with Next.js";

//Const Serve Url
export const SERVER_URL =
  process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:3000";

//Const numb Latest Product
export const LATEST_PRODUCTS_LIMIT =
  Number(process.env.LATEST_PRODUCTS_LIMIT) || 4;

//sign-In Default Values
export const signInDefaultValues = {
  emailOrUsernameOrPhone: "",
  password: "",
};

//sign-Up Default Values
export const signUpDefaultValues = {
  name: "",
  email: "",
  username: "",
  phoneNumber: "",
  password: "",
  confirmPassword: "",
};

//shipping Address Default Values
export const shippingAddressDefaultValues = {
  fullName: "",
  streetAddress: "",
  city: "",
  postalCode: "",
  country: "",
};

//PAYMENT_METHODS
export const PAYMENT_METHODS = process.env.PAYMENT_METHODS
  ? process.env.PAYMENT_METHODS.split(", ")
  : ["PayPal", "Stripe", "CashOnDelivery"];
export const DEFAULT_PAYMENT_METHOD =
  process.env.DEFAULT_PAYMENT_METHOD || "PayPal";

//page size
export const PAGE_SIZE = Number(process.env.PAGE_SIZE) || 10;

//product Default Values
export const productDefaultValues = {
  name: "",
  slug: "",
  category: "",
  images: [],
  brand: "",
  description: "",
  price: "0",
  stock: 0,
  rating: "0",
  numReviews: "0",
  isFeatured: false,
  banner: null,
};

//User Roles Types
export const USER_ROLES = process.env.USER_ROLES
  ? process.env.USER_ROLES.split(", ")
  : ["admin", "user"];

//Category Default Values
export const categoryDefaultValues = {
  name: "",
  icon: "",
};

//review Form Default Values
export const reviewFormDefaultValues = {
  title: "",
  comment: "",
  rating: 0,
};

// SENDER EMAIL
export const SENDER_EMAIL = process.env.SENDER_EMAIL || "onboarding@resend.dev";
