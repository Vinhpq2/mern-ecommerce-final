import { create } from "zustand";
import { languages } from "../languages";
type LanguageStore = {
    lang: string;
    t: {
        home:string,
        login:string,
        signup:string,
        logout:string,
        greeting: string;
        title:string;
        cart:string;
        addToCart: string;
        checkout: string;
        profile: string;
        createAccount:string;
        loginTitle: string;
        password:string;
        yourName:string;
        fullName:string;
        confirmPassword:string;
        alreadyHaveAccount:string;
        noAccount:string;
        loginHere:string;
        signupHere:string;
        loading:string;
        dashboard:string;
        chooseQuantity:string;
        noProductsFound:string;
        emptyCart:string;
        emptyCartTitle:string;
        letBuy:string;
        checkOut:string;
        alsoBought:string;
        haveCouponCode:string;
        enterCode:string;
        signupSuccess:string;
        loginSuccess:string;
        logoutSuccess:string;
        logoutFailed:string;
        signupFailed:string;
        wrongPassword:string;
        invalid:string;
        processing:string;
        orderSummary:string;
        originalPrice:string;
        total:string;
        subTotal:string;
        savings:string;
        continueShopping:string;
        applyCode:string;
        purchaseCancel:string;
        purchaseCancelTitle:string;
        purchaseCancelContact:string;
        returnHome:string;
    };
    setLang: (lang: string) => void;
}
export const useLanguageStore = create<LanguageStore>((set) => ({
  lang: "vi",
  t: languages["vi"],

  setLang: (newLang) =>
  set((state) => {
    if (state.lang === newLang) return state; // không đổi gì nếu giống nhau
    return { lang: newLang, t: languages[newLang] };
  }),

}));
