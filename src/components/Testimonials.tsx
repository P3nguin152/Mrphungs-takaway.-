export default function Testimonials() {
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };
  const testimonials = [
    {
      id: 1,
      name: "Terry",
      date: "Friday 04 July 2025",
      quote: "Always delicious food. we don't eat anywhere else",
      rating: 5,
    },
    {
      id: 2,
      name: "Brenda",
      date: "Wednesday 02 July 2025",
      quote: "Delicious food as always 😋",
      rating: 5,
    },
    {
      id: 3,
      name: "Sheree",
      date: "Friday 27 June 2025",
      quote: "Favourite Chinese always",
      rating: 5,
    },
    {
      id: 4,
      name: "Carl",
      date: "Friday 02 May 2025",
      quote: "good old fashioned Chinese takeaway, excellent food every time",
      rating: 5,
    },
    {
      id: 5,
      name: "Donna",
      date: "Saturday 08 March 2025",
      quote: "Once again an absolutely beautiful meal. Your food is how Chinese food should be cooked. Spareribs gorgeous, chicken chow mein and also the rest I ordered. Worth every penny. Thank you",
      rating: 5,
    },
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900 mb-3">What Our Customers Say</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">Real reviews from happy regulars in Leeds</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {testimonials.map((t) => (
            <div
              key={t.id}
              className="group relative rounded-2xl p-[1px] bg-gradient-to-r from-red-600 via-red-400 to-rose-500 shadow-[0_10px_30px_rgba(0,0,0,0.08)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.12)] transition-all duration-300"
            >
              <div className="h-full rounded-2xl bg-white p-6 md:p-7 flex flex-col">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-600 text-white font-bold">
                      {getInitials(t.name)}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 leading-tight">{t.name}</p>
                      {('date' in t) && (
                        <p className="text-xs text-gray-500">{(t as any).date}</p>
                      )}
                    </div>
                  </div>
                  <div className="text-red-600/20 group-hover:text-red-600/30 transition-colors">
                    <svg className="w-10 h-10" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                      <path d="M7.17 6A5.17 5.17 0 0 0 2 11.17V22h8.28V11.17A5.17 5.17 0 0 0 5.11 6H7.17Zm11.72 0A5.17 5.17 0 0 0 13.72 11.17V22H22V11.17A5.17 5.17 0 0 0 18.89 6h.0Z" />
                    </svg>
                  </div>
                </div>

                <div className="flex items-center mb-3">
                  {[...Array(t.rating)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>

                <p className="text-gray-700 italic leading-relaxed">“{t.quote}”</p>

                <div className="mt-5 flex items-center justify-between">
                  <span className="inline-flex items-center rounded-full bg-red-50 text-red-700 text-xs font-medium px-2.5 py-1 ring-1 ring-inset ring-red-600/20">
                    ★ {t.rating}.0
                  </span>
                  <span className="text-xs text-gray-400">Verified diner</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
