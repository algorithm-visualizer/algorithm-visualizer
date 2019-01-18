FROM rikorose/gcc-cmake

ARG tag_name

RUN curl --create-dirs -o /usr/local/include/nlohmann/json.hpp -L "https://github.com/nlohmann/json/releases/download/v3.1.2/json.hpp" \
 && curl --create-dirs -o /usr/tmp/algorithm-visualizer.tar.gz -L "https://github.com/algorithm-visualizer/tracers.cpp/archive/${tag_name}.tar.gz" \
 && cd /usr/tmp \
 && mkdir algorithm-visualizer \
 && tar xvzf algorithm-visualizer.tar.gz -C algorithm-visualizer --strip-components=1 \
 && cd /usr/tmp/algorithm-visualizer \
 && mkdir build \
 && cd build \
 && cmake .. \
 && make install

CMD g++ Main.cpp -o Main -O2 -std=c++11 -lcurl \
 && ./Main
