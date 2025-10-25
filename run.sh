#!/bin/bash

# Main run script for the entire project
# Supports both Kaggle tools and Segmind MVP

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Helper functions
print_header() {
    echo -e "${BLUE}===============================================${NC}"
    echo -e "${BLUE}  $1${NC}"
    echo -e "${BLUE}===============================================${NC}"
}

print_success() {
    echo -e "${GREEN} $1${NC}"
}

print_error() {
    echo -e "${RED} $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}  $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ $1${NC}"
}

# Check if virtual environment exists
check_venv() {
    if [ ! -d "venv" ]; then
        print_error "Virtual environment not found. Creating one..."
        python3 -m venv venv
        source venv/bin/activate
        pip install -r segmind/requirements.txt
        print_success "Virtual environment created and dependencies installed"
    fi
}

# Activate virtual environment
activate_venv() {
    if [ -f "venv/bin/activate" ]; then
        source venv/bin/activate
        print_success "Virtual environment activated"
    else
        print_error "Virtual environment not found"
        exit 1
    fi
}

# Check if .env file exists
check_env() {
    if [ ! -f ".env" ]; then
        print_warning ".env file not found. Creating template..."
        cat > .env << 'EOF'
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key-here
DATABASE_URL=postgresql://user:password@localhost:5432/segmind
REDIS_URL=redis://localhost:6379
SECRET_KEY=your-secret-key-here
EOF
        print_info "Please update .env with your actual credentials"
    fi
}

# Main menu
show_menu() {
    print_header "Project Manager - Choose an option"
    echo ""
    echo " KAGGLE TOOLS:"
    echo "  1) Load Kaggle CSV to SQLite"
    echo "  2) Upload sample to Supabase"
    echo "  3) Query Supabase data"
    echo "  4) Generate customer insights"
    echo ""
    echo " SEGMIND MVP:"
    echo "  5) Start backend only"
    echo "  6) Start frontend only"
    echo "  7) Start full application (backend + frontend)"
    echo "  8) Seed demo data"
    echo "  9) Install frontend dependencies"
    echo ""
    echo "UTILITIES:"
    echo "  10) Setup environment"
    echo "  11) Check system status"
    echo "  12) Clean up"
    echo "  13) Show help"
    echo ""
    echo "  0) Exit"
    echo ""
    echo -n "Enter your choice [0-13]: "
}

# Kaggle tools functions
run_kaggle_loader() {
    print_header "Loading Kaggle CSV to SQLite"
    activate_venv
    cd kaggle_tools
    python load_ecommerce_to_sqlite.py
    cd ..
}

run_supabase_upload() {
    print_header "Uploading Sample to Supabase"
    activate_venv
    check_env
    cd kaggle_tools
    python upload_sample_to_supabase.py
    cd ..
}

run_supabase_query() {
    print_header "Querying Supabase Data"
    activate_venv
    check_env
    cd kaggle_tools
    python query_supabase.py
    cd ..
}

run_customer_insights() {
    print_header "Generating Customer Insights"
    activate_venv
    check_env
    cd kaggle_tools
    python customer_insights_for_messaging.py
    cd ..
}

# Segmind MVP functions
start_backend() {
    print_header "Starting Segmind Backend"
    activate_venv
    cd segmind
    if [ ! -f "backend/main.py" ]; then
        print_error "Backend not found. Please check segmind/backend/ directory"
        exit 1
    fi
    print_info "Backend starting on http://localhost:8000"
    print_info "API docs available at http://localhost:8000/docs"
    cd backend && uvicorn main:app --reload --host 0.0.0.0 --port 8000
}

start_frontend() {
    print_header "Starting Segmind Frontend"
    cd segmind/frontend
    if [ ! -f "package.json" ]; then
        print_error "Frontend not found. Please check segmind/frontend/ directory"
        exit 1
    fi
    if [ ! -d "node_modules" ]; then
        print_warning "Node modules not found. Installing..."
        npm install
    fi
    print_info "Frontend starting on http://localhost:3000"
    npm run dev
}

start_full_app() {
    print_header "Starting Full Segmind Application"
    activate_venv

    # Check if ports are available
    if lsof -Pi :8000 -sTCP:LISTEN -t >/dev/null 2>&1; then
        print_error "Port 8000 is already in use"
        exit 1
    fi

    if lsof -Pi :3000 -sTCP:LISTEN -t >/dev/null 2>&1; then
        print_error "Port 3000 is already in use"
        exit 1
    fi

    cd segmind
    print_info "Starting backend on http://localhost:8000"
    print_info "Starting frontend on http://localhost:3000"
    print_info "Press Ctrl+C to stop both services"

    # Start backend in background
    (cd backend && uvicorn main:app --reload --host 0.0.0.0 --port 8000) &
    BACKEND_PID=$!

    # Wait a moment for backend to start
    sleep 3

    # Start frontend in background
    (cd frontend && npm run dev) &
    FRONTEND_PID=$!

    # Function to cleanup on exit
    cleanup() {
        print_info "Shutting down services..."
        kill $BACKEND_PID 2>/dev/null || true
        kill $FRONTEND_PID 2>/dev/null || true
        exit 0
    }

    # Set trap to cleanup on exit
    trap cleanup INT TERM

    # Wait for both processes
    wait
}

seed_demo_data() {
    print_header "Seeding Demo Data"
    activate_venv

    # Check if backend is running
    if ! curl -s http://localhost:8000/health >/dev/null 2>&1; then
        print_error "Backend is not running. Please start it first with option 5 or 7"
        exit 1
    fi

    cd segmind/scripts
    python seed_demo.py
    cd ../..
}

install_frontend_deps() {
    print_header "Installing Frontend Dependencies"
    cd segmind/frontend
    if [ ! -f "package.json" ]; then
        print_error "package.json not found"
        exit 1
    fi
    npm install
    print_success "Frontend dependencies installed"
    cd ../..
}

# Utility functions
setup_environment() {
    print_header "Setting up Environment"

    print_info "Checking Python..."
    if ! command -v python3 &> /dev/null; then
        print_error "Python 3 is required but not installed"
        exit 1
    fi
    print_success "Python 3 found"

    print_info "Checking Node.js..."
    if ! command -v node &> /dev/null; then
        print_error "Node.js is required but not installed"
        exit 1
    fi
    print_success "Node.js found"

    print_info "Setting up virtual environment..."
    check_venv

    print_info "Checking environment file..."
    check_env

    print_info "Installing frontend dependencies..."
    install_frontend_deps

    print_success "Environment setup complete!"
}

check_status() {
    print_header "System Status Check"

    # Check Python
    if command -v python3 &> /dev/null; then
        print_success "Python 3: $(python3 --version)"
    else
        print_error "Python 3: Not found"
    fi

    # Check Node.js
    if command -v node &> /dev/null; then
        print_success "Node.js: $(node --version)"
    else
        print_error "Node.js: Not found"
    fi

    # Check virtual environment
    if [ -d "venv" ]; then
        print_success "Virtual environment: Found"
    else
        print_error "Virtual environment: Not found"
    fi

    # Check .env file
    if [ -f ".env" ]; then
        print_success ".env file: Found"
    else
        print_error ".env file: Not found"
    fi

    # Check backend
    if [ -f "segmind/backend/main.py" ]; then
        print_success "Segmind backend: Found"
    else
        print_error "Segmind backend: Not found"
    fi

    # Check frontend
    if [ -f "segmind/frontend/package.json" ]; then
        print_success "Segmind frontend: Found"
        if [ -d "segmind/frontend/node_modules" ]; then
            print_success "Frontend dependencies: Installed"
        else
            print_warning "Frontend dependencies: Not installed"
        fi
    else
        print_error "Segmind frontend: Not found"
    fi

    # Check if services are running
    if curl -s http://localhost:8000/health >/dev/null 2>&1; then
        print_success "Backend service: Running on port 8000"
    else
        print_info "Backend service: Not running"
    fi

    if curl -s http://localhost:3000 >/dev/null 2>&1; then
        print_success "Frontend service: Running on port 3000"
    else
        print_info "Frontend service: Not running"
    fi
}

clean_up() {
    print_header "Cleaning Up"

    print_info "Stopping any running services..."
    pkill -f "uvicorn main:app" 2>/dev/null || true
    pkill -f "npm run dev" 2>/dev/null || true
    pkill -f "next dev" 2>/dev/null || true

    print_info "Cleaning Python cache..."
    find . -type d -name "__pycache__" -exec rm -rf {} + 2>/dev/null || true
    find . -name "*.pyc" -delete 2>/dev/null || true

    print_info "Cleaning Node.js cache..."
    rm -rf segmind/frontend/.next 2>/dev/null || true

    print_success "Cleanup complete"
}

show_help() {
    print_header "Help & Usage"
    echo ""
    echo " SEGMIND MVP - Customer Messaging Platform"
    echo "   A Twilio-like platform with advanced customer segmentation"
    echo "   Features: Customer segments, multi-channel messaging, analytics"
    echo ""
    echo " KAGGLE TOOLS - E-commerce Data Processing"
    echo "   Tools to process 67M+ e-commerce events from Kaggle dataset"
    echo "   Extract customer insights for messaging campaigns"
    echo ""
    echo "QUICK START:"
    echo "   1. Run 'Setup environment' (option 10)"
    echo "   2. Start full application (option 7)"
    echo "   3. Seed demo data (option 8)"
    echo "   4. Visit http://localhost:3000"
    echo ""
    echo "PROJECT STRUCTURE:"
    echo "   ├── kaggle_tools/     # Data processing scripts"
    echo "   ├── segmind/          # MVP messaging platform"
    echo "   │   ├── backend/      # FastAPI backend"
    echo "   │   ├── frontend/     # Next.js dashboard"
    echo "   │   └── sdk/          # JavaScript SDK"
    echo "   ├── venv/             # Python virtual environment"
    echo "   └── .env              # Environment variables"
    echo ""
    echo "USEFUL URLS:"
    echo "   Backend API: http://localhost:8000"
    echo "   API Docs: http://localhost:8000/docs"
    echo "   Frontend: http://localhost:3000"
    echo ""
}

# Main execution
main() {
    clear

    # Check if we're in the right directory
    if [ ! -d "segmind" ] && [ ! -d "kaggle_tools" ]; then
        print_error "Please run this script from the project root directory"
        exit 1
    fi

    while true; do
        show_menu
        read choice
        echo ""

        case $choice in
            1) run_kaggle_loader ;;
            2) run_supabase_upload ;;
            3) run_supabase_query ;;
            4) run_customer_insights ;;
            5) start_backend ;;
            6) start_frontend ;;
            7) start_full_app ;;
            8) seed_demo_data ;;
            9) install_frontend_deps ;;
            10) setup_environment ;;
            11) check_status ;;
            12) clean_up ;;
            13) show_help ;;
            0)
                print_info "Goodbye!"
                exit 0
                ;;
            *)
                print_error "Invalid option. Please try again."
                ;;
        esac

        echo ""
        echo -n "Press Enter to continue..."
        read
        clear
    done
}

# Run main function
main "$@"