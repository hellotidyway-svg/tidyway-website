const reviews = [
  {
    name: 'Sarah M.',
    text: 'TidyWay did an incredible job on our home in Byron. The team was professional, on time, and the house looked spotless. Will definitely be booking again!',
  },
  {
    name: 'James T.',
    text: 'Booked a move-out clean for my place near Western. Landlord did the walkthrough and had zero complaints. Worth every penny.',
  },
  {
    name: 'Lisa K.',
    text: "I've tried a few cleaning services in London and TidyWay is easily the best. Same cleaner every two weeks, she knows exactly what I like.",
  },
];

function Stars() {
  return (
    <div className="flex gap-0.5 mb-4">
      {[...Array(5)].map((_, i) => (
        <svg key={i} className="w-5 h-5 text-yellow-400 fill-current" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

export default function Reviews() {
  return (
    <section className="bg-white" style={{ paddingTop: 40, paddingBottom: 40 }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <h2 className="text-3xl md:text-4xl font-extrabold text-[#0F1C3F]">
            What Our Customers Say
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {reviews.map(review => (
            <div
              key={review.name}
              className="bg-white border border-gray-100 rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow flex flex-col"
            >
              <Stars />
              <p className="text-gray-600 leading-relaxed flex-1 mb-6 text-sm">
                &ldquo;{review.text}&rdquo;
              </p>
              <div className="flex items-center justify-between border-t border-gray-50 pt-4">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-[#0F1C3F] text-[#2DD4A7] font-extrabold text-sm flex items-center justify-center">
                    {review.name[0]}
                  </div>
                  <span className="font-bold text-[#0F1C3F] text-sm">{review.name}</span>
                </div>
                <span className="text-xs text-gray-400 font-medium">Verified Google Review</span>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center">
          <a
            href="#lead-form"
            className="inline-block bg-[#2DD4A7] hover:bg-[#22c497] text-white font-extrabold px-10 py-4 rounded-xl text-lg transition-colors"
          >
            Book Your Clean Today →
          </a>
        </div>
      </div>
    </section>
  );
}
