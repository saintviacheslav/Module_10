import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

export enum Theme {
  LIGHT = "light",
  DARK = "dark"
};

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | null>(null);
//убрать as и по возморжности убрать из юзстейта функцию -- у меня не получилось, так как без функции в useState тема не подтягивается корректно из localstorage, а устанавливается по дефолту, а as не убирается по этой же причине, так как в useState требуется вернуть корректное значение темы.
export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme | null>(null);

  useEffect(() => {
    const root = document.documentElement;
    const localStorageTheme = localStorage.getItem("theme");
    const savedTheme = localStorageTheme === Theme.LIGHT ? Theme.LIGHT : Theme.DARK;

    if (savedTheme === Theme.DARK) {
      root.setAttribute("data-theme", Theme.DARK);
    } else {
      root.setAttribute("data-theme", Theme.LIGHT);
    }

    if (!localStorageTheme) {
      localStorage.setItem("theme", savedTheme);
    }

    setTheme(savedTheme);
  }, []);

  const toggleTheme = () => {
    const root = document.documentElement;

    if (!theme) {
      throw new Error("Theme is not found");
    }

    setTheme((prev) => (prev === Theme.DARK ? Theme.LIGHT : Theme.DARK));

    if (theme === Theme.DARK) {
      root.setAttribute("data-theme", Theme.LIGHT);
      localStorage.setItem("theme", Theme.LIGHT);
    } else {
      root.setAttribute("data-theme", Theme.DARK);
      localStorage.setItem("theme", Theme.DARK);
    }
  };

  if (!theme) {
    return null;
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeContext);

  if(!context){
    throw new Error("error message");
  }
  
  return context;
};
