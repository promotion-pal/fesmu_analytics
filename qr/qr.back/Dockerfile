FROM golang:1.26-alpine

WORKDIR /app

COPY go.mod go.sum ./
RUN go mod tidy
RUN go mod download

COPY . .

RUN go build -o qr-back .

EXPOSE 8000
CMD ["./qr-back"]