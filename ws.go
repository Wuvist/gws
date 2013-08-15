package main

import (
	"code.google.com/p/go.net/websocket"
	"errors"
	"log"
	"net/http"
	"net/rpc"
	"net/rpc/jsonrpc"
)

type Args struct {
	A, B int
}

type Quotient struct {
	Quo, Rem int
}

type Arith int

func (t *Arith) Multiply(args *Args, reply *int) error {
	log.Println("Multiply:", *args)
	*reply = args.A * args.B
	return nil
}

func (t *Arith) Divide(args *Args, quo *Quotient) error {
	if args.B == 0 {
		return errors.New("divide by zero")
	}
	quo.Quo = args.A / args.B
	quo.Rem = args.A % args.B
	return nil
}

func (t *Arith) Echo(arg *string, reply *string) error {
	log.Println("received:", *arg)
	*reply = *arg
	return nil
}

var server *rpc.Server

func WSRPC(ws *websocket.Conn) {
	server.ServeCodec(jsonrpc.NewServerCodec(ws))
}

func main() {
	server = rpc.NewServer()
	arith := new(Arith)
	server.Register(arith)

	http.Handle("/", websocket.Handler(WSRPC))

	if err := http.ListenAndServe(":9999", nil); err != nil {
		log.Fatal("ListenAndServe:", err)
	}
}
