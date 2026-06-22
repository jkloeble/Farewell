# WIFIMO: Notebooks für die Evaluation der Experimente im DASU Büro

In diesem Ordner finden sich verschiedene Arten von Notebooks. 

- Das Notebook "DASU_testlauf_exploration.ipynb" beinhaltet Untersuchungen, die auf einigen Datenreihen angestellt wurden, die beim Herumexperimentieren, mit dem Aufnahme-Setup entstanden sind. Es diente nur zum Kennenlernen der Umgebung und beinhaltet keine wichtigen Ergebnisse.

- Die Notebooks mit dem Präfix "Evaluation_" beinhalten hauptsächlich Visualisierungen der jeweiligen Versuchsreihen, die in den DASU Büroräumen ausgeführt wurden.

- Diejenigen mit dem Präfix "Classification_" beinhalten eine Pipeline, in der auf die aufgenommenen Daten aus den Experimenten ein "Preprocessing" angewandt wird. Die vorbereiteten Daten werden dann in einr KFold-Crossvalidation (mehrmals) in Trainings- und Test-Datensätze unterteilt. Die Trainingsdaten werden genutzt, um ein xgboost-Modell zu trainieren, welches mit den Testdaten evaluiert wird. Die Notebook enthalten außerdem Darstellungen, in denen eine "Echtzeit"-Klassifizierung simuliert wird.

- Die Notebooks "EvaluationWallTrial1.ipynb" und "EvaluationWallTrial2.ipynb" enthalten Visualisierungen zweier kleiner Experiment-Reihen, bei denen Receiver und Transmitter in verschiedenen Räumen so positioniert wurden, dass sich eine Wand dazwischen befand. Aus Ermangelung an Zeit wurden die Ergebnisse nicht in die Dokumentation aufgenommen. In den Notebokks finden sich aber dieselben Visualisierungen wir für die restlichen Versuche.