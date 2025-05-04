export default function ProfileLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="background">
      <section className="blog py-8 md:pt-40 md:pb-10 lg:pt-44 lg:pb-14">
        <div className="container">
          {/* <!-- Section Head --> */}
          <div className="flex items-end justify-between mb-5 md:mb-12">
            <h2 className="section-title">پنل کاربری</h2>
          </div>

          <div className="flex flex-col lg:flex-row items-center lg:items-start justify-center lg:justify-start gap-x-5">
            {/* <!-- Biography & User Panel --> */}
            <div className="flex lg:flex-col lg:items-start justify-center lg:justify-center w-full lg:w-auto mb-5 gap-x-2 lg:gap-x-0"></div>

            {children}
          </div>
        </div>
      </section>
    </main>
  );
}
