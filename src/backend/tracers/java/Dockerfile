FROM openjdk:8

ARG tag_name

RUN curl --create-dirs -o /usr/local/lib/algorithm-visualizer.jar -L "https://github.com/algorithm-visualizer/tracers.java/releases/download/${tag_name}/algorithm-visualizer.jar"

CMD javac -cp /usr/local/lib/algorithm-visualizer.jar Main.java \
 && java -cp /usr/local/lib/algorithm-visualizer.jar:. Main
