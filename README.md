* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: Arial, sans-serif;
  background: #0b1020;
  color: #ffffff;
  line-height: 1.6;
}

.container {
  width: min(1200px, 92%);
  margin: auto;
}

header {
  background: #11182d;
  border-bottom: 1px solid #27304a;
  padding: 18px 0;
  position: sticky;
  top: 0;
  z-index: 100;
}

.nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
}

.logo {
  font-size: 22px;
  font-weight: 800;
  color: #ffffff;
}

.logo span {
  color: #4ade80;
}

nav a {
  color: #cbd5e1;
  text-decoration: none;
  margin-left: 22px;
  font-size: 15px;
}

nav a:hover {
  color: #4ade80;
}

.hero {
  padding: 90px 0 70px;
  text-align: center;
}

.hero h1 {
  font-size: clamp(38px, 7vw, 72px);
  line-height: 1.05;
  margin-bottom: 22px;
}

.hero h1 span {
  color: #4ade80;
}

.hero p {
  max-width: 760px;
  margin: 0 auto 32px;
  color: #aab5ca;
  font-size: 18px;
}

.btn {
  display: inline-block;
  background: #4ade80;
  color: #07110b;
  padding: 14px 28px;
  border-radius: 10px;
  text-decoration: none;
  font-weight: 700;
  border: none;
  cursor: pointer;
}

.btn:hover {
  background: #22c55e;
}

.section {
  padding: 70px 0;
}

.section-title {
  text-align: center;
  font-size: 34px;
  margin-bottom: 12px;
}

.section-subtitle {
  text-align: center;
  color: #94a3b8;
  margin-bottom: 40px;
}

.grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 22px;
}

.card {
  background: #121a30;
  border: 1px solid #27304a;
  border-radius: 16px;
  padding: 26px;
}

.card h3 {
  margin-bottom: 10px;
  font-size: 21px;
}

.card p {
  color: #9eabc0;
}

.badge {
  display: inline-block;
  margin-bottom: 16px;
  padding: 6px 10px;
  border-radius: 20px;
  background: #193526;
  color: #4ade80;
  font-size: 13px;
  font-weight: 700;
}

.cta {
  background: #121a30;
  border: 1px solid #27304a;
  border-radius: 20px;
  padding: 45px;
  text-align: center;
}

footer {
  margin-top: 50px;
  padding: 30px 0;
  border-top: 1px solid #27304a;
  color: #718096;
  text-align: center;
}

@media (max-width: 800px) {
  .grid {
    grid-template-columns: 1fr;
  }

  .nav {
    flex-direction: column;
  }

  nav a {
    margin: 0 8px;
  }

  .hero {
    padding-top: 60px;
  }

  .cta {
    padding: 30px 20px;
  }
}
