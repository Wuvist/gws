package main

import (
	"fmt"
	"github.com/golang/groupcache"
	"io/ioutil"
	"log"
	"net/http"
)

var stringcache = groupcache.NewGroup("Solr", 64<<20, groupcache.GetterFunc(
	func(ctx groupcache.Context, key string, dest groupcache.Sink) error {
		resp, _ := http.Get(key)
		defer resp.Body.Close()
		body, _ := ioutil.ReadAll(resp.Body)

		log.Printf("asking for %s from solr\n", key)
		dest.SetString(string(body))
		return nil
	}))

func proxyHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("content-type", "application/json")
	url := "http://moapi.com:8080" + r.URL.Path + "?" + r.URL.RawQuery

	var s string
	stringcache.Get(nil, url, groupcache.StringSink(&s))
	fmt.Fprintf(w, s)
}

func main() {
	log.Print("starting")
	http.HandleFunc("/select/", proxyHandler)

	if err := http.ListenAndServe(":8889", nil); err != nil {
		log.Fatal("ListenAndServe:", err)
	}
}
