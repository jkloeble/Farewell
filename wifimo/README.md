Für die korrekte Ausführung des Projekts ist wie folgt vorzugehen:

Beim ersten Öffnen des Projekts muss zuerst in den Ordner "{path_to_project}/code/" navigiert werden und die Entwicklungsumgebung installiert werden. Dazu muss in den "codes"-Ordner navigiert werden und die dort abgelegte Pipenv-Shell installiert werden. Dafür wird zunächst die Datei "setup_env.py" ausgeführt, um einige PATH-Variablen richtig einzurichten. Anschließend wird über den Befehl "pipenv install --ignore-pipenv" die Entwicklungsumgebung installiert, was auch die Installation aller benötigten Python-Packages beinhaltet. Durch den Suffix "--ignore-pipenv" wird sichergestellt, dass die Package-Dependencies aus der Datei "Pipfile.lock" für die Installation verwendet werden und die Umgebung gleich wie beim ursprünglichen entwickler installiert wird.
    cd {path_to_project}/code/
    python3 setup_env.py
    pipenv install --ignore-pipenv
    pipenv shell

Vor jedem Öffnen des Projekts, auch wenn eines der Jupyter-Notebooks geöffnet werden soll, muss die Pipenv-Shell im "code"-Ordner gestartet werden:
    cd {path_to_project}/code/
    pipenv shell

Zum Öffnen der Jupyter-Notebooks muss nach dem starten der Pipenv-Shell zunächst zum "notebooks"-Ordner navigiert und von dort aus die Jupyter-Lab Umgebung gestartet werden.
    cd {path_to_project}/notebooks/
    jupyter lab

Zum Erzeugen der Ergebnisse für die Analysen auf den Daten des Vorgängermodells von Helbling, wird die Methode "{path_to_project}/code/model/main.py" aufgerufen:
    cd {path_to_project}/code/model
    python3 main.py
 Sämtliche anderen Skripte werden entweder durch dieses Skript oder inerhalb der Jupyter-Notebooks aufgerufen und sind nicht ausführbar.
