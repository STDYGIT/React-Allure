const supabase = require('../config/supabase')

// GET all services (PUBLIC)
exports.getServices = async (req, res) => {
  console.log('➡️ GET /api/services called')

  try {
    const { data: services, error } = await supabase
      .from('services')
      .select(`
        *,
        service_icons (
          id,
          name,
          icon_class,
          icon_image,
          is_lucide
        )
      `)
      .eq('is_active', true)
      .order('order', { ascending: true })
      .order('created_at', { ascending: false })

    if (error) {
      // Table doesn't exist or other database error
      if (error.code === '42P01' || error.code === 'PGRST204') {
        console.log('⚠️  Services table does not exist or is empty')
        return res.json([])
      }
      throw error
    }

    // Transform service_icons from nested object to array format
    const transformedServices = services.map(service => ({
      ...service,
      service_icons: service.service_icons ? [service.service_icons] : []
    }))

    console.log('✅ Services fetched:', transformedServices.length)
    res.json(transformedServices)
  } catch (error) {
    console.error('❌ Database error:', error)
    res.json([]) // Return empty array on any error
  }
}

// CREATE service (ADMIN)
exports.createService = async (req, res) => {
  try {
    const {
      name,
      description,
      icon_id,
      is_active = true,
      order = 0
    } = req.body

    const { data, error } = await supabase
      .from('services')
      .insert({
        name,
        description,
        icon_id: icon_id || null,
        is_active,
        order
      })
      .select()
      .single()

    if (error) throw error

    res.status(201).json(data)
  } catch (error) {
    console.error('Create service error:', error)
    res.status(400).json({ error: error.message || 'Failed to create service' })
  }
}

// UPDATE service (ADMIN)
exports.updateService = async (req, res) => {
  try {
    const { id } = req.params
    const updates = req.body

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ error: 'No fields to update' })
    }

    const { data, error } = await supabase
      .from('services')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return res.status(404).json({ error: 'Service not found' })
      }
      throw error
    }

    res.json(data)
  } catch (error) {
    console.error('Update service error:', error)
    res.status(400).json({ error: error.message || 'Failed to update service' })
  }
}

// DELETE service (ADMIN)
exports.deleteService = async (req, res) => {
  try {
    const { id } = req.params

    const { data, error } = await supabase
      .from('services')
      .delete()
      .eq('id', id)
      .select('id')
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return res.status(404).json({ error: 'Service not found' })
      }
      throw error
    }

    res.json({ success: true })
  } catch (error) {
    console.error('Delete service error:', error)
    res.status(400).json({ error: error.message || 'Failed to delete service' })
  }
}