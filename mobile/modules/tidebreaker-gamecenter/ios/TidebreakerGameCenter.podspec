Pod::Spec.new do |s|
  s.name           = 'TidebreakerGameCenter'
  s.version        = '1.0.0'
  s.summary        = 'Apple Game Center bridge for Tidebreaker'
  s.description    = 'Signs the player in to Game Center, submits scores and shows leaderboards.'
  s.license        = 'UNLICENSED'
  s.author         = 'Tidebreaker'
  s.homepage       = 'https://tidebreaker.app'
  s.platforms      = { :ios => '16.4' }
  s.swift_version  = '5.9'
  s.source         = { git: '' }
  s.static_framework = true
  s.dependency 'ExpoModulesCore'
  s.frameworks     = 'GameKit'
  s.source_files   = '**/*.{h,m,swift}'
  s.pod_target_xcconfig = { 'DEFINES_MODULE' => 'YES' }
end
