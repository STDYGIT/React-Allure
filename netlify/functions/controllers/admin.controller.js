const supabase = require('../config/supabase')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

// Admin Login
exports.login = async (req, res) => {
    try {
        console.log("=== LOGIN REQUEST DEBUG ===")
        console.log("HEADERS:", req.headers)
        console.log("RAW BODY:", req.body)
        console.log("BODY TYPE:", typeof req.body)
        console.log("BODY IS STRING:", typeof req.body === 'string')
        console.log("BODY IS OBJECT:", typeof req.body === 'object')
        console.log("BODY CONSTRUCTOR:", req.body?.constructor?.name)
        
        // If body is a string, parse it
        let bodyData = req.body
        if (typeof req.body === 'string') {
            console.log("Body is string, parsing...")
            try {
                bodyData = JSON.parse(req.body)
                console.log("Parsed successfully:", bodyData)
            } catch (parseError) {
                console.error("Failed to parse body:", parseError)
                return res.status(400).json({ error: 'Invalid JSON in request body' })
            }
        }
        
        console.log("FINAL BODY DATA:", bodyData)
        const { email, password } = bodyData
        
        console.log("EXTRACTED EMAIL:", email)
        console.log("EXTRACTED PASSWORD:", password ? "***" : undefined)
        console.log("EMAIL EXISTS:", !!email)
        console.log("PASSWORD EXISTS:", !!password)
        console.log("EMAIL TYPE:", typeof email)
        console.log("PASSWORD TYPE:", typeof password)
        console.log("=== END DEBUG ===")

        if (!email || !password) {
            console.log("VALIDATION FAILED - Missing email or password")
            return res.status(400).json({ error: 'Email and password are required' })
        }

        console.log("Validation passed, checking database...")

        // Check if admin exists
        const { data: admins, error } = await supabase
            .from('admin_users')
            .select('*')
            .eq('email', email)
            .limit(1)

        if (error) {
            console.error('Database error:', error)
            throw error
        }

        if (!admins || admins.length === 0) {
            console.log("No admin found with email:", email)
            return res.status(401).json({ error: 'Invalid credentials' })
        }

        const admin = admins[0]
        console.log("Admin found:", admin.email)

        // Verify password
        const isValid = await bcrypt.compare(password, admin.password)
        if (!isValid) {
            console.log("Password verification failed")
            return res.status(401).json({ error: 'Invalid credentials' })
        }

        console.log("Password verified, generating token...")

        // Generate JWT token
        const token = jwt.sign(
            { id: admin.id, email: admin.email },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        )

        console.log("Login successful for:", admin.email)

        res.json({
            token,
            admin: {
                id: admin.id,
                email: admin.email,
                name: admin.name
            }
        })
    } catch (error) {
        console.error('Login error:', error)
        res.status(500).json({ error: 'Login failed', details: error.message })
    }
}

// Get Dashboard Stats
exports.getStats = async (req, res) => {
    try {
        // Get counts for all tables in parallel
        const [videosResult, servicesResult, contactsResult] = await Promise.all([
            supabase
                .from('videos')
                .select('*', { count: 'exact', head: true })
                .then(({ count, error }) => ({ count: error ? 0 : count }))
                .catch(() => ({ count: 0 })),
            
            supabase
                .from('services')
                .select('*', { count: 'exact', head: true })
                .then(({ count, error }) => ({ count: error ? 0 : count }))
                .catch(() => ({ count: 0 })),
            
            supabase
                .from('contacts')
                .select('id, is_contacted')
                .then(({ data, error }) => ({ data: error ? [] : data }))
                .catch(() => ({ data: [] }))
        ])

        const totalVideos = videosResult.count || 0
        const totalServices = servicesResult.count || 0
        const totalContacts = contactsResult.data?.length || 0
        const newLeads = contactsResult.data?.filter(c => !c.is_contacted).length || 0

        res.json({
            totalVideos,
            totalServices,
            totalContacts,
            newLeads
        })
    } catch (error) {
        console.error('Stats error:', error)
        // Return zeros if tables don't exist
        res.json({
            totalVideos: 0,
            totalServices: 0,
            totalContacts: 0,
            newLeads: 0
        })
    }
}

// Get All Contacts
exports.getContacts = async (req, res) => {
    try {
        // Get contacts with their services using RPC or separate queries
        const { data: contacts, error: contactsError } = await supabase
            .from('contacts')
            .select(`
                *,
                contact_services (
                    service_id,
                    services (
                        id,
                        name
                    )
                )
            `)
            .order('created_at', { ascending: false })

        if (contactsError) {
            console.error('Get contacts error:', contactsError)
            // If contacts table doesn't exist, return empty array
            if (contactsError.code === '42P01') {
                return res.json([])
            }
            throw contactsError
        }

        // Transform the data to match your expected format
        const transformedContacts = contacts.map(contact => ({
            ...contact,
            services: contact.contact_services
                ?.map(cs => cs.services?.name)
                .filter(Boolean) || [],
            contact_services: undefined // Remove the nested structure
        }))

        res.json(transformedContacts)
    } catch (error) {
        console.error('Get contacts error:', error)
        res.status(500).json({ error: 'Failed to fetch contacts', details: error.message })
    }
}