function Card({ title, value }) {
  return (
    <div className="p-6 border rounded-xl border-n-200 bg-n-200 backdrop-blur">

      <p className="mb-2 text-sm text-n-50">
        {title}
      </p>

      <h3 className="text-3xl font-semibold text-n-100">
        {value}
      </h3>

    </div>
  );
}

export default Card;