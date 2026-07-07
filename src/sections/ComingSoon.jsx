const ComingSoon = () => {
  return (
    <section className="entrance-message">
      <div className="h-full col-center gap-10">
        <img src="./images/logo.webp" alt="logo" className="entrance-logo scale-105" />
        <div className="text-wrapper text-center">
          <h3 className="gradient-title">
            GTA <br /> MONEY TEAM
          </h3>
          <p className="text-pink font-long uppercase text-xl md:text-3xl tracking-widest mt-4">
            Learn How To Make Money The Legit Way.
          </p>
        </div>

        <div className="flex-center gap-10 mt-6">
          <img
            src="./images/ps-logo.svg"
            alt="ps5-logo"
            className="md:w-32 w-20"
          />
          <img
            src="./images/x-logo.svg"
            alt="xBox-logo"
            className="md:w-52 w-40"
          />
        </div>
      </div>
    </section>
  );
};
export default ComingSoon;
