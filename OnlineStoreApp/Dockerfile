FROM maven:3.9-eclipse-temurin-17-alpine AS build

WORKDIR /app

COPY pom.xml .
RUN mvn -B dependency:go-offline

COPY src ./src
RUN mvn -B package -DskipTests

FROM tomcat:9.0-jre17-temurin

ENV CATALINA_HOME=/usr/local/tomcat

RUN rm -rf ${CATALINA_HOME}/webapps/* \
    && groupadd -r app \
    && useradd -r -g app -d ${CATALINA_HOME} -s /usr/sbin/nologin app \
    && chown -R app:app ${CATALINA_HOME}

COPY --from=build --chown=app:app /app/target/OnlineStoreApp.war ${CATALINA_HOME}/webapps/OnlineStoreApp.war

USER app

EXPOSE 8080

CMD ["catalina.sh", "run"]
