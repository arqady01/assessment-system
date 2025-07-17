FROM ubuntu:22.04

RUN apt-get update && apt-get install -y \
    build-essential \
    cmake \
    libssl-dev \
    libjsoncpp-dev \
    libboost-all-dev \
    pkg-config \
    git \
    curl \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY . .

RUN make clean && make release

RUN useradd -r -s /bin/false security && \
    mkdir -p /var/log/security-validator && \
    chown security:security /var/log/security-validator

USER security

EXPOSE 8080

HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD echo '{"operation":"health_check","data":{}}' | ./security_validator || exit 1

CMD ["./security_validator"]
