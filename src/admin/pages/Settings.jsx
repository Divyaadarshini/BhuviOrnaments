import { useState } from "react";
import { useAdmin } from "../AdminContext";
import { Field } from "../ui";
export default function Settings() {
  const { data, update } = useAdmin(),
    S = data.settings,
    [f, setF] = useState({
      wa: S.wa,
      ship: S.ship,
      free: S.free,
      cats: S.cats.join(", "),
    }),
    [done, setDone] = useState(false);
  const s = (k) => ({
    value: f[k],
    onChange: (e) => {
      setF({ ...f, [k]: e.target.value });
      setDone(false);
    },
  });
  const save = () => {
    update((d) => ({
      ...d,
      settings: {
        ...d.settings,
        wa: f.wa.replace(/\D/g, ""),
        ship: +f.ship || 0,
        free: +f.free || 0,
        cats: f.cats
          .split(",")
          .map((x) => x.trim())
          .filter(Boolean),
      },
    }));
    setDone(true);
  };
  return (
    <>
      <h2>Store settings</h2>
      <div className="fm" style={{ marginTop: 12 }}>
        <Field label="WhatsApp number (with 91)">
          <input {...s("wa")} />
        </Field>
        <Field label="Shipping fee (₹)">
          <input type="number" {...s("ship")} />
        </Field>
        <Field label="Free shipping above (₹)">
          <input type="number" {...s("free")} />
        </Field>
        <Field full label="Categories (comma separated)">
          <input {...s("cats")} />
        </Field>
      </div>
      <div className="bar2">
        <button className="btn" onClick={save}>
          Save settings
        </button>
        {done && <span className="ok">Saved</span>}
      </div>
    </>
  );
}
