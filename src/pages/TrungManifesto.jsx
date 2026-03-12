export default function TrungManifesto() {
  const steps = [
    {
      number: 1,
      text: "Fill your bottle with the knowledge of the world.",
      icon: "📖",
    },
    {
      number: 2,
      text: "Compress it to find wisdom.",
      icon: "🔬",
    },
    {
      number: 3,
      text: "Empty the vessel.",
      icon: "🫙",
    },
    {
      number: 4,
      text: "Empty the wisdom within the vessel to the world, to anyone you meet freely, until it's empty.",
      icon: "🌊",
    },
    {
      number: 5,
      text: "So that you can go back again to filling up the vessel again with more knowledge to compact wisdom.",
      icon: "🔄",
    },
  ]

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(175deg, #FFF8ED 0%, #FDF2E0 35%, #F7ECDA 65%, #FFF5E6 100%)",
      fontFamily: "'Georgia', 'Noto Serif', serif",
      color: "#3D2B1F",
      padding: "40px 16px",
    }}>
      <div style={{ maxWidth: 640, margin: "0 auto" }}>

        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <div style={{
            fontSize: 11, letterSpacing: 5, color: "#B8956A", textTransform: "uppercase", marginBottom: 10,
            fontFamily: "'Segoe UI', sans-serif",
          }}>
            Math Festa · The First Principle
          </div>
          <h1 style={{ fontSize: 38, fontWeight: 700, margin: 0, color: "#8B4513", letterSpacing: "1px" }}>
            The Trung Manifesto
          </h1>
          <div style={{
            width: 60, height: 2,
            background: "linear-gradient(90deg, transparent, #C8860A, transparent)",
            margin: "12px auto",
          }} />
          <p style={{ fontSize: 15, color: "#8B6A3E", fontStyle: "italic", margin: 0, lineHeight: 1.7 }}>
            A cycle. A way of being.
          </p>
        </div>

        {/* Steps */}
        <div style={{ position: "relative" }}>
          {/* Vertical connector line */}
          <div style={{
            position: "absolute",
            left: 28,
            top: 28,
            bottom: 28,
            width: 2,
            background: "linear-gradient(180deg, #DAA520, #C8860A88, #DAA520)",
            borderRadius: 2,
          }} />

          {steps.map((step, i) => (
            <div key={step.number} style={{
              display: "flex",
              gap: 20,
              marginBottom: i < steps.length - 1 ? 32 : 0,
              position: "relative",
            }}>
              {/* Circle number */}
              <div style={{
                flexShrink: 0,
                width: 56,
                height: 56,
                borderRadius: "50%",
                background: "linear-gradient(135deg, #FFF1D0, #FFEAB8)",
                border: "2px solid #C8860A",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 20,
                boxShadow: "0 4px 12px rgba(200,134,10,0.18)",
                zIndex: 1,
              }}>
                {step.icon}
              </div>

              {/* Text card */}
              <div style={{
                flex: 1,
                background: "#FFFDF7",
                border: "1px solid #E8D5B5",
                borderRadius: 16,
                padding: "16px 20px",
                boxShadow: "0 4px 16px rgba(120,80,30,0.06)",
                alignSelf: "center",
              }}>
                <div style={{
                  fontSize: 10, letterSpacing: 2, color: "#C8860A", textTransform: "uppercase",
                  fontFamily: "'Segoe UI', sans-serif", marginBottom: 5, fontWeight: 700,
                }}>
                  Step {step.number}
                </div>
                <p style={{ fontSize: 16, lineHeight: 1.75, margin: 0, color: "#3D2B1F" }}>
                  {step.text}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Cycle callout */}
        <div style={{
          marginTop: 44,
          background: "linear-gradient(135deg, #FFF8E8, #FFF1D0)",
          border: "2px solid #C8860A33",
          borderRadius: 20,
          padding: "24px 28px",
          textAlign: "center",
          boxShadow: "0 6px 24px rgba(200,134,10,0.1)",
        }}>
          <div style={{ fontSize: 32, marginBottom: 12 }}>∞</div>
          <p style={{
            fontSize: 17, color: "#7A4A0A", fontWeight: 700, margin: 0,
            letterSpacing: "0.5px", lineHeight: 1.6,
          }}>
            It's a cycle.
          </p>
          <p style={{
            fontSize: 13, color: "#A0896E", margin: "8px 0 0", fontStyle: "italic", lineHeight: 1.7,
          }}>
            Fill → Compress → Empty → Give → Fill again.
          </p>
        </div>

        {/* Footer */}
        <div style={{
          textAlign: "center", padding: "28px 0 12px",
          fontSize: 11, color: "#C4B49A", fontStyle: "italic",
        }}>
          The Trung Manifesto · Math Festa
        </div>
      </div>
    </div>
  )
}
