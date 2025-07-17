CXX = g++
CXXFLAGS = -std=c++17 -O3 -Wall -Wextra -march=native -mtune=native
LDFLAGS = -lssl -lcrypto -ljsoncpp -lpthread

SECURITY_TARGET = security_validator
MARKDOWN_TARGET = markdown_renderer
SRCDIR = .
SECURITY_SOURCES = security_validator.cpp
MARKDOWN_SOURCES = markdown_renderer.cpp
SECURITY_OBJECTS = $(SECURITY_SOURCES:.cpp=.o)
MARKDOWN_OBJECTS = $(MARKDOWN_SOURCES:.cpp=.o)

INSTALL_DIR = /usr/local/bin
SERVICE_DIR = /etc/systemd/system

.PHONY: all clean install uninstall service security markdown

all: security markdown

security: $(SECURITY_TARGET)
markdown: $(MARKDOWN_TARGET)

$(SECURITY_TARGET): $(SECURITY_OBJECTS)
	$(CXX) $(SECURITY_OBJECTS) -o $@ $(LDFLAGS)

$(MARKDOWN_TARGET): $(MARKDOWN_OBJECTS)
	$(CXX) $(MARKDOWN_OBJECTS) -o $@ $(LDFLAGS)

%.o: %.cpp
	$(CXX) $(CXXFLAGS) -c $< -o $@

clean:
	rm -f $(SECURITY_OBJECTS) $(MARKDOWN_OBJECTS) $(SECURITY_TARGET) $(MARKDOWN_TARGET)

install: all
	sudo cp $(SECURITY_TARGET) $(INSTALL_DIR)/
	sudo cp $(MARKDOWN_TARGET) $(INSTALL_DIR)/
	sudo chmod +x $(INSTALL_DIR)/$(SECURITY_TARGET)
	sudo chmod +x $(INSTALL_DIR)/$(MARKDOWN_TARGET)

uninstall:
	sudo rm -f $(INSTALL_DIR)/$(SECURITY_TARGET)
	sudo rm -f $(INSTALL_DIR)/$(MARKDOWN_TARGET)

service: install
	sudo cp security_validator.service $(SERVICE_DIR)/
	sudo systemctl daemon-reload
	sudo systemctl enable security_validator
	sudo systemctl start security_validator

benchmark: $(TARGET)
	./$(TARGET) < benchmark_input.json

test: $(TARGET)
	./run_tests.sh

deps:
	sudo apt-get update
	sudo apt-get install -y libssl-dev libjsoncpp-dev build-essential

docker-build:
	docker build -t security-validator .

docker-run:
	docker run -d --name security-validator-container security-validator

performance-test: $(TARGET)
	echo '{"operation":"benchmark","data":{"iterations":10000}}' | ./$(TARGET)

memory-check: $(TARGET)
	valgrind --leak-check=full --show-leak-kinds=all ./$(TARGET) < test_input.json

static-analysis:
	cppcheck --enable=all --std=c++17 $(SOURCES)

format:
	clang-format -i $(SOURCES)

release: clean
	$(MAKE) CXXFLAGS="$(CXXFLAGS) -DNDEBUG -flto" all
	strip $(TARGET)

debug: clean
	$(MAKE) CXXFLAGS="$(CXXFLAGS) -g -DDEBUG -fsanitize=address" LDFLAGS="$(LDFLAGS) -fsanitize=address" all
