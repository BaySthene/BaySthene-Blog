---
title: "React Hooks Rehberi"
excerpt: "React Hooks'un temellerini ve ileri düzey kullanımlarını öğrenin."
coverImage: "/developer.jpg"
date: "2024-12-25"
tags: ["React", "Hooks", "JavaScript"]
---

# React Hooks Rehberi

React 16.8 ile tanıtılan Hooks, fonksiyonel component'lerde state ve lifecycle yönetimini mümkün kıldı.

## useState

En temel hook, state yönetimi için kullanılır:

```jsx
const [count, setCount] = useState(0);
```

## useEffect

Side effect'ler için kullanılır:

```jsx
useEffect(() => {
  document.title = `Count: ${count}`;
}, [count]);
```

## useContext

Context API ile global state yönetimi:

```jsx
const theme = useContext(ThemeContext);
```

## Custom Hooks

Kendi hook'larınızı oluşturabilirsiniz:

```jsx
function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : initialValue;
  });
  
  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);
  
  return [value, setValue];
}
```

Hooks ile temiz ve yeniden kullanılabilir kod yazabilirsiniz!
