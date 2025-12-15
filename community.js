const discussions = [
    {
      id: 1,
      title: "EUR/USD Breaking Key Resistance - What's Next?",
      author: "TraderMike",
      time: "2 hours ago",
      preview:
        "Just noticed EUR/USD broke through 1.0850 resistance. Based on H4 supply and demand, looking at 1.0920 as next target...",
      replies: 24,
      likes: 15,
    },
    {
      id: 2,
      title: "Best Supply/Demand Strategy for Beginners",
      author: "ForexGuru",
      time: "5 hours ago",
      preview:
        "Sharing my proven supply and demand strategy that helped me go from consistent losses to profitable trading...",
      replies: 48,
      likes: 32,
    },
    {
      id: 3,
      title: "H4 vs 15min Timeframes - Which Do You Prefer?",
      author: "ChartMaster",
      time: "1 day ago",
      preview:
        "Curious what timeframes everyone is using for their supply/demand analysis. I personally love H4 for swing trades...",
      replies: 67,
      likes: 28,
    },
    {
      id: 4,
      title: "Gold (XAU/USD) Setup Looking Promising",
      author: "GoldTrader99",
      time: "1 day ago",
      preview: "Strong demand zone forming on gold at $2,020. High probability long setup with great risk-reward...",
      replies: 19,
      likes: 22,
    },
    {
      id: 5,
      title: "How I Made 300 Pips This Week Using RTR Signals",
      author: "SuccessStory",
      time: "2 days ago",
      preview: "Following the RTR analysis and supply/demand zones, I managed to capture some amazing moves this week...",
      replies: 89,
      likes: 54,
    },
  ]
  
  function loadDiscussions() {
    const discussionsList = document.getElementById("discussionsList")
  
    discussionsList.innerHTML = discussions
      .map(
        (discussion) => `
          <div class="discussion-item">
              <div class="discussion-header">
                  <div>
                      <div class="discussion-title">${discussion.title}</div>
                      <div class="discussion-meta">${discussion.author} • ${discussion.time}</div>
                  </div>
              </div>
              <div class="discussion-preview">${discussion.preview}</div>
              <div class="discussion-footer">
                  <span>💬 ${discussion.replies} replies</span>
                  <span>❤️ ${discussion.likes} likes</span>
              </div>
          </div>
      `,
      )
      .join("")
  }
  
  function handleFormSubmit(e) {
    e.preventDefault()
  
    const name = document.getElementById("name").value
    const email = document.getElementById("email").value
    const experience = document.getElementById("experience").value
  
    // In a real app, this would send data to a server
    console.log("[v0] Form submitted:", { name, email, experience })
  
    alert(`Welcome to the Rags to Riches community, ${name}! We'll send you an email at ${email} with next steps.`)
  
    // Reset form
    document.getElementById("joinForm").reset()
  }
  
  // Initialize page
  document.addEventListener("DOMContentLoaded", () => {
    loadDiscussions()
    document.getElementById("joinForm").addEventListener("submit", handleFormSubmit)
  })