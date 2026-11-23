import ExpoModulesCore
import GameKit
import UIKit

// Dismisses the Game Center screen when the player taps Done.
final class GameCenterDismisser: NSObject, GKGameCenterControllerDelegate {
  func gameCenterViewControllerDidFinish(_ gameCenterViewController: GKGameCenterViewController) {
    gameCenterViewController.dismiss(animated: true)
  }
}

public class TidebreakerGameCenterModule: Module {
  private let dismisser = GameCenterDismisser()
  private var handlerInstalled = false

  public func definition() -> ModuleDefinition {
    Name("TidebreakerGameCenter")

    Function("authenticate") {
      DispatchQueue.main.async { self.authenticateIfNeeded() }
    }

    Function("submitScore") { (leaderboardId: String, score: Int) in
      DispatchQueue.main.async {
        guard GKLocalPlayer.local.isAuthenticated else { return }
        GKLeaderboard.submitScore(score, context: 0, player: GKLocalPlayer.local, leaderboardIDs: [leaderboardId]) { _ in }
      }
    }

    Function("showLeaderboard") { (leaderboardId: String) in
      DispatchQueue.main.async {
        guard GKLocalPlayer.local.isAuthenticated else {
          self.authenticateIfNeeded()
          return
        }
        let vc = GKGameCenterViewController(leaderboardID: leaderboardId, playerScope: .global, timeScope: .allTime)
        vc.gameCenterDelegate = self.dismisser
        Self.topViewController()?.present(vc, animated: true)
      }
    }
  }

  private func authenticateIfNeeded() {
    if handlerInstalled { return }
    handlerInstalled = true
    GKLocalPlayer.local.authenticateHandler = { viewController, _ in
      if let viewController = viewController {
        Self.topViewController()?.present(viewController, animated: true)
      }
    }
  }

  private static func topViewController() -> UIViewController? {
    let scenes = UIApplication.shared.connectedScenes.compactMap { $0 as? UIWindowScene }
    let window = scenes.flatMap { $0.windows }.first { $0.isKeyWindow } ?? scenes.first?.windows.first
    var top = window?.rootViewController
    while let presented = top?.presentedViewController { top = presented }
    return top
  }
}
