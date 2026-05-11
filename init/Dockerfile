FROM golang:1.21-alpine

WORKDIR /app

COPY *.go ./
RUN go mod init init || true
RUN go mod tidy
RUN go build -o init .

EXPOSE 8080
CMD ["./init"]