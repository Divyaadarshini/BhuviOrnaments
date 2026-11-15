import { useState } from "react";
import { useAdmin } from "../AdminContext";
import { Modal, Field } from "../ui";
import { fmt } from "../../services/catalog";
const slug = (s) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
function Form({ init, id, data, onSave, onClose }) {
  const [f, setF] = useState(init),
    [err, setErr] = useState("");
  const s = (k) => ({
      value: f[k] ?? "",
      onChange: (e) => setF({ ...f, [k]: e.target.value }),
    }),
    c = (k) => ({
      checked: !!f[k],
      onChange: (e) => setF({ ...f, [k]: e.target.checked }),
    });
  const np = +f.newPrice,
    okNew = np > 0 && np < +f.price,
    was = Math.max(+f.mrp || 0, +f.price);
  const save = () => {
    if (!f.name.trim() || !(+f.price > 0))
      return setErr("Enter a name and a selling price.");
    if (f.newPrice && !okNew)
      return setErr("New price must be lower than the selling price.");
    let nid = id || slug(f.name);
    if (!id) {
      let n = 2,
        b = nid;
      while (data.products.some((p) => p.id === nid)) nid = `${b}-${n++}`;
    }
    onSave({
      ...f,
      newPrice: undefined,
      id: nid,
      name: f.name.trim(),
      price: okNew ? np : +f.price,
      mrp: okNew ? was : +f.mrp || +f.price,
      stock: +f.stock || 0,
      vars: f.vars
        .split(",")
        .map((x) => x.trim())
        .filter(Boolean),
    });
  };
  return (
    <Modal onClose={onClose}>
      <h2>{id ? "Edit" : "Add"} product</h2>
      <div className="fm" style={{ marginTop: 12 }}>
        <Field full label="Name *">
          <input {...s("name")} />
        </Field>
        <Field label="SKU">
          <input {...s("sku")} />
        </Field>
        <Field label="Category">
          <select {...s("cat")}>
            {data.settings.cats.map((x) => (
              <option key={x}>{x}</option>
            ))}
          </select>
        </Field>
        <Field label="Selling price *">
          <input type="number" {...s("price")} />
        </Field>
        <Field label="MRP (original)">
          <input type="number" {...s("mrp")} />
        </Field>
        <Field label="Stock">
          <input type="number" {...s("stock")} />
        </Field>
        <Field label="Tags">
          <input {...s("tags")} />
        </Field>
        <Field
          full
          label="New price (optional): the old price will be cut through"
        >
          <input type="number" {...s("newPrice")} placeholder="e.g. 1199" />
          {okNew && (
            <p style={{ margin: "6px 0 0" }}>
              <s className="cc">{fmt(was)}</s> <b>{fmt(np)}</b>{" "}
              <span className="ok">−{Math.round((1 - np / was) * 100)}%</span>
            </p>
          )}
        </Field>
        <Field full label="Description">
          <textarea rows="3" {...s("desc")} />
        </Field>
        <Field label="Material">
          <input {...s("mat")} />
        </Field>
        <Field label="Variants (comma separated)">
          <input {...s("vars")} />
        </Field>
        <Field full label="Image path (e.g. /images/pearl-necklace.jpg)">
          <input {...s("img")} />
        </Field>
        <label className="l">
          <input type="checkbox" {...c("isNew")} /> New arrival
        </label>
        <label className="l">
          <input type="checkbox" {...c("best")} /> Best seller
        </label>
      </div>
      <p className="er">{err}</p>
      <div className="bar2">
        <button className="btn" onClick={save}>
          Save
        </button>
        <button className="btn ghost" onClick={onClose}>
          Cancel
        </button>
      </div>
    </Modal>
  );
}
export default function Products() {
  const { data, update } = useAdmin(),
    [q, setQ] = useState(""),
    [edit, setEdit] = useState(null),
    P = data.products;
  const rows = P.filter((p) =>
    (p.name + (p.sku || "") + p.cat).toLowerCase().includes(q.toLowerCase())
  );
  const blank = {
    name: "",
    sku: "",
    cat: data.settings.cats[0] || "",
    price: "",
    mrp: "",
    stock: 1,
    tags: "",
    desc: "",
    mat: "",
    vars: "",
    img: "",
    isNew: false,
    best: false,
  };
  const save = (p) => {
    update((d) => ({
      ...d,
      products: d.products.some((x) => x.id === p.id)
        ? d.products.map((x) => (x.id === p.id ? p : x))
        : [p, ...d.products],
    }));
    setEdit(null);
  };
  const remove = (id) =>
    confirm("Delete this product?") &&
    update((d) => ({
      ...d,
      products: d.products.filter((p) => p.id !== id),
      offers: d.offers.map((o) => ({
        ...o,
        items: Object.fromEntries(
          Object.entries(o.items).filter(([k]) => k !== id)
        ),
      })),
    }));
  const stock = (id, n) =>
    update((d) => ({
      ...d,
      products: d.products.map((p) =>
        p.id === id ? { ...p, stock: +n || 0 } : p
      ),
    }));
  return (
    <>
      <div className="cards">
        <div className="c">
          <b>{P.length}</b>Products
        </div>
        <div className="c">
          <b>{P.filter((p) => p.stock > 0).length}</b>In stock
        </div>
        <div className="c">
          <b>{P.filter((p) => p.stock <= 0).length}</b>Out of stock
        </div>
        <div className="c">
          <b>{data.settings.cats.length}</b>Categories
        </div>
      </div>
      <div className="bar2">
        <input
          placeholder="Search products"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
        <button
          className="btn"
          style={{ whiteSpace: "nowrap" }}
          onClick={() => setEdit({ id: "", init: blank })}
        >
          Add product
        </button>
      </div>
      <div className="sc">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Category</th>
              <th>Price</th>
              <th>Stock</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {rows.map((p) => (
              <tr key={p.id}>
                <td>
                  {p.name}
                  <br />
                  <small className="cc">{p.sku}</small>
                </td>
                <td>{p.cat}</td>
                <td>{fmt(p.price)}</td>
                <td style={{ width: 90 }}>
                  <input
                    type="number"
                    min="0"
                    defaultValue={p.stock}
                    onBlur={(e) => stock(p.id, e.target.value)}
                  />
                </td>
                <td style={{ whiteSpace: "nowrap" }}>
                  <button
                    className="btn ghost"
                    onClick={() =>
                      setEdit({
                        id: p.id,
                        init: { ...p, vars: (p.vars || []).join(", ") },
                      })
                    }
                  >
                    Edit
                  </button>{" "}
                  <button className="btn dng" onClick={() => remove(p.id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {!rows.length && (
              <tr>
                <td colSpan="5">No products found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {edit && (
        <Form
          {...edit}
          data={data}
          onSave={save}
          onClose={() => setEdit(null)}
        />
      )}
    </>
  );
}
