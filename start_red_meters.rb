#!/usr/bin/env ruby
# frozen_string_literal: true

# RedMeters Development Environment Launcher
# Starts backend (Ruby/Sinatra) and frontend (React/Vite) servers

require 'fileutils'
require 'json'
require 'rbconfig'
require 'socket'
require 'timeout'

class RedMetersStarter
  STATE_FILE = File.expand_path('.start_state.json', __dir__)
  BACKEND_PORT_START = 4567
  FRONTEND_PORT_START = 5173

  def self.start
    new.run
  end

  def initialize
    @root_dir = File.expand_path(__dir__)
    @frontend_dir = File.join(@root_dir, 'frontend')
  end

  def run
    puts "\n"
    puts '=' * 60
    puts '  ⚡ RedMeters - Smart Grid Analytics'
    puts '=' * 60
    puts ''

    # Truncate logs before starting
    truncate_logs

    # Check prerequisites
    check_prerequisites

    # Find available ports
    backend_port = find_available_port(BACKEND_PORT_START)
    frontend_port = find_available_port(FRONTEND_PORT_START)

    puts "📍 Port Selection:"
    puts "   Backend:  #{backend_port}"
    puts "   Frontend: #{frontend_port}"
    puts ''

    # Configure ports (required - no fallbacks)
    configure_ports(backend_port, frontend_port)

    # Check if ports are already in use by other processes
    check_ports(backend_port, frontend_port)

    # Start servers
    puts '🚀 Starting servers...'
    puts ''

    backend_pid = start_backend(backend_port)
    sleep 2 # Give backend time to start

    frontend_pid = start_frontend(frontend_port)

    # Wait for servers to be ready
    wait_for_servers(backend_port, frontend_port)

    puts ''
    puts '=' * 60
    puts '✅ RedMeters is running!'
    puts '=' * 60
    puts ''
    puts "   🖥️  Frontend: http://localhost:#{frontend_port}"
    puts "   🔧 Backend:  http://localhost:#{backend_port}"
    puts "   ❤️  Health:   http://localhost:#{backend_port}/health"
    puts ''
    puts '   Press Ctrl+C to stop all servers'
    puts '=' * 60

    # Open Chrome
    open_browser("http://localhost:#{frontend_port}")

    # Wait for interrupt
    trap('INT') do
      puts "\n\n👋 Shutting down servers..."
      Process.kill('TERM', backend_pid) rescue nil
      Process.kill('TERM', frontend_pid) rescue nil
      puts 'Goodbye!'
      exit 0
    end

    # Keep main process alive
    Process.wait(frontend_pid)
  rescue Interrupt
    puts "\n\n👋 Shutting down..."
    exit 0
  rescue StandardError => e
    puts "\n❌ Error: #{e.message}"
    puts e.backtrace.first(5).join("\n") if ENV['DEBUG']
    exit 1
  end

  private

  # ============================================
  # State Management
  # ============================================

  def load_state
    return {} unless File.exist?(STATE_FILE)

    JSON.parse(File.read(STATE_FILE), symbolize_names: true)
  rescue StandardError
    {}
  end

  def save_state(key, value)
    state = load_state
    state[key] = value
    File.write(STATE_FILE, JSON.pretty_generate(state))
  rescue StandardError => e
    puts "⚠️  Could not save state: #{e.message}"
  end

  # ============================================
  # Input with Timeout
  # ============================================

  def prompt_with_timeout(prompt, default, timeout_seconds = 10)
    print "#{prompt} (default: #{default}, timeout: #{timeout_seconds}s): "

    choice = nil
    begin
      Timeout.timeout(timeout_seconds) do
        choice = $stdin.gets&.chomp
      end
    rescue Timeout::Error
      puts "\n⏱️  Timeout - using default"
      choice = ''
    end

    choice.nil? || choice.empty? ? default : choice
  end

  # ============================================
  # Prerequisites
  # ============================================

  def check_prerequisites
    puts '🔍 Checking prerequisites...'
    puts ''

    # Check for bundler
    unless system('which bundle > /dev/null 2>&1')
      puts '❌ Bundler not found'
      puts '   Run: gem install bundler'
      exit 1
    end
    puts '   ✓ Bundler found'

    # Check for node/npm
    unless system('which npm > /dev/null 2>&1')
      puts '❌ npm not found'
      puts '   Please install Node.js from https://nodejs.org'
      exit 1
    end
    puts '   ✓ npm found'

    # Check for .env file
    check_env_file

    # Check frontend dependencies
    check_frontend_dependencies

    puts ''
  end

  def check_env_file
    env_file = File.join(@root_dir, '.env')
    template = File.join(@root_dir, 'env.example.template')

    if File.exist?(env_file)
      puts '   ✓ .env file exists'
      return
    end

    puts ''
    puts '⚠️  No .env file found'
    puts ''

    unless File.exist?(template)
      puts '❌ No env.example.template found'
      puts '   Cannot create .env file'
      exit 1
    end

    state = load_state
    default_choice = state[:create_env] || 'y'

    choice = prompt_with_timeout(
      'Create .env from template? [Y/n]',
      default_choice
    ).downcase

    save_state(:create_env, choice)

    if choice == 'y' || choice == 'yes' || choice == ''
      FileUtils.cp(template, env_file)
      puts '   ✓ Created .env from template'
    else
      puts '❌ .env file is required'
      exit 1
    end
  end

  def check_frontend_dependencies
    node_modules = File.join(@frontend_dir, 'node_modules')

    if Dir.exist?(node_modules)
      puts '   ✓ Frontend dependencies installed'
      return
    end

    puts ''
    puts '⚠️  Frontend dependencies not installed'
    puts ''

    state = load_state
    default_choice = state[:install_deps] || 'y'

    choice = prompt_with_timeout(
      'Install frontend dependencies now? [Y/n]',
      default_choice
    ).downcase

    save_state(:install_deps, choice)

    if choice == 'y' || choice == 'yes' || choice == ''
      puts '   📦 Installing frontend dependencies...'
      Dir.chdir(@frontend_dir) do
        unless system('npm install')
          puts '❌ npm install failed'
          exit 1
        end
      end
      puts '   ✓ Frontend dependencies installed'
    else
      puts '❌ Frontend dependencies are required'
      exit 1
    end
  end

  # ============================================
  # Port Management
  # ============================================

  def find_available_port(start_port)
    port = start_port
    while port < start_port + 100
      return port if port_available?(port)
      port += 1
    end
    raise "No available port found starting from #{start_port}"
  end

  def port_available?(port)
    server = TCPServer.new('127.0.0.1', port)
    server.close
    true
  rescue Errno::EADDRINUSE
    false
  end

  def port_in_use?(port)
    !port_available?(port)
  end

  def check_ports(backend_port, frontend_port)
    ports_in_use = {}
    ports_in_use[:backend] = backend_port if port_in_use?(backend_port)
    ports_in_use[:frontend] = frontend_port if port_in_use?(frontend_port)

    return if ports_in_use.empty?

    puts '⚠️  Some ports are already in use:'
    puts ''

    ports_in_use.each do |service, port|
      pid = `lsof -ti:#{port}`.strip.split("\n").first
      if pid && !pid.empty?
        process_name = `ps -p #{pid} -o comm= 2>/dev/null`.strip
        process_name = 'unknown' if process_name.empty?
        puts "   • Port #{port} (#{service}): used by #{process_name} (PID: #{pid})"
      else
        puts "   • Port #{port} (#{service}): in use"
      end
    end

    puts ''

    state = load_state
    default_choice = state[:port_conflict_action] || '1'

    puts 'What would you like to do?'
    puts ''
    puts '  1) Kill processes and use these ports'
    puts '  2) Exit and handle manually'
    puts ''

    choice = prompt_with_timeout(
      'Enter your choice [1-2]',
      default_choice
    )

    save_state(:port_conflict_action, choice)

    case choice
    when '1'
      puts ''
      puts '🔪 Killing processes on conflicting ports...'

      ports_in_use.each_value do |port|
        kill_port(port)
      end

      sleep 1

      # Verify ports are now free
      still_in_use = ports_in_use.select { |_, port| port_in_use?(port) }

      unless still_in_use.empty?
        puts ''
        puts "❌ Failed to free ports: #{still_in_use.values.join(', ')}"
        puts '   Please kill these processes manually and try again.'
        exit 1
      end

      puts '   ✓ All ports freed'
      puts ''
    when '2'
      puts ''
      puts '👋 Exiting...'
      exit 0
    else
      puts ''
      puts '❌ Invalid choice. Exiting...'
      exit 1
    end
  end

  def kill_port(port)
    system("lsof -ti:#{port} | xargs kill -9 2>/dev/null")
  end

  # ============================================
  # Port Configuration (No Fallbacks)
  # ============================================

  def configure_ports(backend_port, frontend_port)
    puts '⚙️  Configuring ports...'

    # 1. REQUIRED: Create frontend .env with VITE_API_URL
    #    Frontend FAILS without this (no fallbacks per PRINCIPLES.md)
    frontend_env = File.join(@frontend_dir, '.env')
    frontend_env_content = "VITE_API_URL=http://localhost:#{backend_port}\n"

    existing_content = File.exist?(frontend_env) ? File.read(frontend_env) : ''
    if existing_content.include?('VITE_API_URL=')
      new_content = existing_content.gsub(/VITE_API_URL=.*/, "VITE_API_URL=http://localhost:#{backend_port}")
    else
      new_content = existing_content + frontend_env_content
    end
    File.write(frontend_env, new_content)
    puts "   ✓ frontend/.env: VITE_API_URL=http://localhost:#{backend_port}"

    # 2. Update vite.config.js proxy settings
    vite_config = File.join(@frontend_dir, 'vite.config.js')
    raise "vite.config.js not found at #{vite_config}" unless File.exist?(vite_config)

    content = File.read(vite_config)
    new_content = content.gsub(
      /target:\s*['"]http:\/\/localhost:\d{4,5}['"]/,
      "target: 'http://localhost:#{backend_port}'"
    )
    File.write(vite_config, new_content)
    puts "   ✓ vite.config.js: proxy target → localhost:#{backend_port}"

    # 3. Update backend .env CORS_ORIGIN (if present)
    env_file = File.join(@root_dir, '.env')
    if File.exist?(env_file)
      content = File.read(env_file)
      if content.include?('CORS_ORIGIN=')
        new_content = content.gsub(
          /CORS_ORIGIN=http:\/\/localhost:\d{4,5}/,
          "CORS_ORIGIN=http://localhost:#{frontend_port}"
        )
        File.write(env_file, new_content)
        puts "   ✓ .env: CORS_ORIGIN=http://localhost:#{frontend_port}"
      end
    end

    puts ''
  end

  # ============================================
  # Log Management
  # ============================================

  def truncate_logs
    puts '🧹 Truncating logs...'

    log_dir = File.join(@root_dir, 'log')
    Dir.mkdir(log_dir) unless Dir.exist?(log_dir)

    log_patterns = [
      File.join(@root_dir, 'log', '*.log'),
      File.join(@root_dir, '*.log')
    ]

    truncated_count = 0
    total_size_before = 0

    log_patterns.each do |pattern|
      Dir.glob(pattern).each do |log_file|
        next unless File.file?(log_file)

        total_size_before += File.size(log_file)
        File.truncate(log_file, 0)
        truncated_count += 1
      end
    end

    if truncated_count > 0
      size_freed_mb = (total_size_before / (1024.0 * 1024.0)).round(1)
      puts "   ✓ Truncated #{truncated_count} log file(s) (freed #{size_freed_mb}MB)"
    else
      puts '   ✓ No log files to truncate'
    end

    puts ''
  end

  # ============================================
  # Server Management
  # ============================================

  def start_backend(port)
    puts "   Starting backend on port #{port}..."

    Dir.chdir(@root_dir) do
      # Ensure log directory exists
      Dir.mkdir('log') unless Dir.exist?('log')

      pid = spawn(
        "bundle exec rackup -p #{port} -o 0.0.0.0",
        out: File.open('log/backend.log', 'a'),
        err: File.open('log/backend.log', 'a')
      )
      Process.detach(pid)

      puts "   ✓ Backend started (PID: #{pid})"
      pid
    end
  end

  def start_frontend(port)
    puts "   Starting frontend on port #{port}..."

    Dir.chdir(@frontend_dir) do
      pid = spawn(
        "npm run dev -- --port #{port}",
        out: $stdout,
        err: $stderr
      )

      puts "   ✓ Frontend started (PID: #{pid})"
      pid
    end
  end

  def wait_for_servers(backend_port, frontend_port)
    puts ''
    puts '⏳ Waiting for servers to be ready...'

    max_attempts = 30
    attempt = 0
    backend_ok = false
    frontend_ok = false

    while attempt < max_attempts
      sleep 1
      attempt += 1

      # Check backend
      unless backend_ok
        if system("curl -s http://localhost:#{backend_port}/health > /dev/null 2>&1")
          puts '   ✓ Backend is responding'
          backend_ok = true
        end
      end

      # Check frontend
      unless frontend_ok
        if system("curl -s http://localhost:#{frontend_port} > /dev/null 2>&1")
          puts '   ✓ Frontend is responding'
          frontend_ok = true
        end
      end

      return if backend_ok && frontend_ok

      print '.' if attempt % 3 == 0
    end

    puts ''
    puts '⚠️  Servers are taking longer than expected to start'
    puts '   Check log/backend.log for backend errors'
  end

  # ============================================
  # Browser
  # ============================================

  def open_browser(url)
    puts ''
    puts "🌐 Opening Chrome at #{url}..."

    case RbConfig::CONFIG['host_os']
    when /darwin/i
      # macOS
      system("open -a 'Google Chrome' '#{url}' 2>/dev/null") ||
        system("open '#{url}'")
    when /linux/i
      # Linux
      system("google-chrome '#{url}' 2>/dev/null") ||
        system("chromium '#{url}' 2>/dev/null") ||
        system("xdg-open '#{url}'")
    when /mswin|mingw|cygwin/i
      # Windows
      system("start chrome '#{url}' 2>NUL") ||
        system("start '#{url}'")
    else
      puts "⚠️  Unknown OS - please open #{url} manually"
    end
  end
end

# Run if executed directly
RedMetersStarter.start if __FILE__ == $PROGRAM_NAME
