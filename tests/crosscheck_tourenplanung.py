"""Unabhängige Nachimplementierung der Rätselregeln in Python.
Prüft: Musterlösung gültig, Brute-Force ergibt exakt eine Lösung."""
from itertools import permutations
import json

TRAVEL = {
    "D": {"D": 0, "A": 15, "P": 15, "E": 20, "B": 20, "F": 25},
    "A": {"D": 15, "A": 0, "P": 25, "E": 12, "B": 25, "F": 25},
    "P": {"D": 15, "A": 25, "P": 0, "E": 20, "B": 25, "F": 25},
    "E": {"D": 20, "A": 12, "P": 20, "E": 0, "B": 15, "F": 15},
    "B": {"D": 20, "A": 25, "P": 25, "E": 15, "B": 0, "F": 5},
    "F": {"D": 25, "A": 25, "P": 25, "E": 15, "B": 5, "F": 0},
}
START, E_START = 480, 570  # 08:00, 09:30
DUR = {"A": 30, "P": 5, "E": 45, "B": 10, "F": 40}


def simulate(plan):
    """plan: dict sprinter/caddy -> Reihenfolge (E in beiden). Liefert Fehlerliste."""
    errors = []
    st = {v: {"t": START, "loc": "D", "crew": 2 if v == "sprinter" else 1,
              "hasM": False, "done": set()} for v in plan}

    def do_leg(v, tasks):
        s = st[v]
        for tid in tasks:
            s["t"] += TRAVEL[s["loc"]][tid]
            s["loc"] = tid
            start = s["t"]
            if tid == "P":
                start = max(start, 510)  # Zug 08:30
            if tid == "F":
                start = max(start, 630)  # Kran ab 10:30
            end = start + DUR[tid]
            if tid == "A" and start > 525: errors.append("a-zu-spaet")
            if tid == "F" and end > 720: errors.append("f-fenster")
            if tid == "B" and v != "sprinter": errors.append("b-im-caddy")
            need = {"A": 2, "P": 1, "B": 2, "F": 2}[tid]
            if s["crew"] < need: errors.append("crew")
            if tid == "F" and "B" not in s["done"]: errors.append("f-ohne-b")
            s["t"] = end
            s["done"].add(tid)
            if tid == "P":
                s["crew"] += 1
                s["hasM"] = True

    pre, post = {}, {}
    for v, seq in plan.items():
        i = seq.index("E") if "E" in seq else len(seq)
        pre[v], post[v] = seq[:i], seq[i + 1:] if "E" in seq else []

    for v in plan: do_leg(v, pre[v])

    # Rendezvous E
    start_e = E_START
    for v in plan:
        st[v]["t"] += TRAVEL[st[v]["loc"]]["E"]
        st[v]["loc"] = "E"
        if st[v]["t"] > E_START: errors.append("e-zu-spaet")
        start_e = max(start_e, st[v]["t"])
    if sum(st[v]["crew"] for v in plan) < 4: errors.append("e-personen")
    if not any(st[v]["hasM"] for v in plan): errors.append("e-ohne-m")
    for v in plan:
        st[v]["t"] = start_e + DUR["E"]
        st[v]["done"].add("E")

    for v in plan: do_leg(v, post[v])
    return errors


others = ["A", "P", "B", "F"]
valid, total = [], 0
for mask in range(16):
    s_tasks = [t for i, t in enumerate(others) if mask & (1 << i)]
    c_tasks = [t for i, t in enumerate(others) if not mask & (1 << i)]
    for sp in permutations(s_tasks):
        for cp in permutations(c_tasks):
            for si in range(len(sp) + 1):
                for ci in range(len(cp) + 1):
                    plan = {"sprinter": list(sp[:si]) + ["E"] + list(sp[si:]),
                            "caddy": list(cp[:ci]) + ["E"] + list(cp[ci:])}
                    total += 1
                    if not simulate(plan):
                        valid.append(json.dumps(plan))

print(f"{total} Pläne geprüft, gültig: {len(valid)}")
for v in valid:
    print(" ", v)
expected = json.dumps({"sprinter": ["A", "E", "B", "F"], "caddy": ["P", "E"]})
assert valid == [expected], "Eindeutigkeit verletzt oder falsche Lösung!"
print("OK: exakt eine Lösung, identisch mit der Vorgabe.")
