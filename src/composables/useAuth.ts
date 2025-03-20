import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import axios from "../utils/axios";

export function useAuth() {
  const isAuthenticated = ref(false);
  const user = ref(null);
  const router = useRouter();

  const checkAuth = async () => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const response = await axios.get("/account/me");
        if (response.data.code === "SUCCESS") {
          isAuthenticated.value = true;
          user.value = response.data.data;
        } else {
          localStorage.removeItem("token");
          isAuthenticated.value = false;
          user.value = null;
        }
      } catch (error) {
        console.error("Auth check error:", error);
        localStorage.removeItem("token");
        isAuthenticated.value = false;
        user.value = null;
      }
    } else {
      isAuthenticated.value = false;
      user.value = null;
    }
  };

  const handleGoogleLogin = async () => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");

    if (token) {
      try {
        localStorage.setItem("token", token);
        const response = await axios.get("/account/me");
        if (response.data.code === "SUCCESS") {
          window.history.replaceState(
            {},
            document.title,
            window.location.pathname
          );
          isAuthenticated.value = true;
          user.value = response.data.data;
          router.push("/home");
        } else {
          localStorage.removeItem("token");
          isAuthenticated.value = false;
          user.value = null;
        }
      } catch (error) {
        console.error("Google login error:", error);
        localStorage.removeItem("token");
        isAuthenticated.value = false;
        user.value = null;
      }
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    isAuthenticated.value = false;
    user.value = null;
    router.push("/login");
  };

  onMounted(() => {
    checkAuth();
    handleGoogleLogin();
  });

  return {
    isAuthenticated,
    user,
    checkAuth,
    logout,
  };
}
