package main

import (
	"fmt"
	"log"
	"net/http"
)

type RouteConfig struct {
	URL  string
	Path map[string]string
}

func (rc *RouteConfig) guard(w http.ResponseWriter, r *http.Request) {
	currentPath := r.URL.Path
	id := r.URL.Query().Get("id")

	fmt.Printf("Пришел запрос: путь=%s, id=%s\n", currentPath, id)

	if id != "" {
		fullURL := fmt.Sprintf("%s/analytic/qr?id=%s", rc.URL, id)
		fmt.Printf("Редирект по ID: %s\n", fullURL)
		http.Redirect(w, r, fullURL, http.StatusFound)
		return
	}

	if newPath, exists := rc.Path[currentPath]; exists {
		fullURL := rc.URL + newPath
		http.Redirect(w, r, fullURL, http.StatusFound)
		return
	}

	http.NotFound(w, r)
}

func main() {
	config := &RouteConfig{
		URL: "http://localhost:4173",
		Path: map[string]string{
			"/old": "/new",
		},
	}

	http.HandleFunc("/", config.guard)

	fmt.Println("Сервер запущен на http://localhost:8080")
	log.Fatal(http.ListenAndServe(":8080", nil))
}

// package main

// import (
// 	"fmt"
// 	"log"
// 	"net/http"
// 	"strings"
// )

// type RouteConfig struct {
// 	URL  string
// 	Path map[string]string
// }

// func (rc *RouteConfig) guard(w http.ResponseWriter, r *http.Request) {
// 	currentPath := r.URL.Path

// 	fmt.Println("Пришел запрос на путь:", currentPath)
// 	fmt.Println("Полный URL:", r.URL.String())

// 	if newPath, exists := rc.Path[currentPath]; exists {
// 		fullURL := rc.URL + newPath
// 		fmt.Printf("Редирект с %s → %s\n", currentPath, fullURL)
// 		http.Redirect(w, r, fullURL, http.StatusFound)
// 		return
// 	}

// 	for oldPath, newPath := range rc.Path {
// 		if strings.Contains(currentPath, oldPath) {
// 			fullURL := rc.URL + strings.Replace(currentPath, oldPath, newPath, 1)
// 			fmt.Printf("Частичный редирект: %s → %s\n", currentPath, fullURL)
// 			http.Redirect(w, r, fullURL, http.StatusFound)
// 			return
// 		}
// 	}

// 	fmt.Println("Путь не найден:", currentPath)
// 	http.NotFound(w, r)
// }

// func main() {
// 	config := &RouteConfig{
// 		URL: "localhost:4173",
// 		Path: map[string]string{
// 			"/old":         "/new",
// 			"/analytic/qr": "/analytic/qr",
// 		},
// 	}

// 	http.HandleFunc("/", config.guard)

// 	fmt.Println("Сервер запущен на http://localhost:8080")
// 	log.Fatal(http.ListenAndServe(":8080", nil))
// }
