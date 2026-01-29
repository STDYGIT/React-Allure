const supabase = require('../config/supabase')

// GET all videos (PUBLIC)
exports.getVideos = async (req, res) => {
  try {
    const { data: videos, error } = await supabase
      .from('videos')
      .select(`
        *,
        video_types (
          id,
          name
        )
      `)
      .order('order', { ascending: true })
      .order('created_at', { ascending: false })

    if (error) {
      // Table doesn't exist or other database error
      if (error.code === '42P01' || error.code === 'PGRST204') {
        return res.json([])
      }
      throw error
    }

    // Transform video_types from nested object to expected format
    const transformedVideos = videos.map(video => ({
      ...video,
      video_types: video.video_types || null
    }))

    res.json(transformedVideos)
  } catch (error) {
    console.error('Get videos error:', error)
    res.json([]) // Return empty array on any error
  }
}

// CREATE video (ADMIN)
exports.createVideo = async (req, res) => {
  try {
    const {
      video_name,
      video_description,
      video_type_id,
      is_featured = false,
      order = 0
    } = req.body

    const video_url = req.files?.video?.[0]?.path || null
    const thumbnail_url = req.files?.thumbnail?.[0]?.path || null

    console.log('VIDEO URL:', video_url)
    console.log('THUMB URL:', thumbnail_url)

    const { data, error } = await supabase
      .from('videos')
      .insert({
        video_name,
        video_description,
        video_url,
        thumbnail_url,
        video_type_id: video_type_id || null,
        is_featured,
        order
      })
      .select()
      .single()

    if (error) throw error

    res.status(201).json(data)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Upload failed', details: err.message })
  }
}

// UPDATE video (ADMIN)
exports.updateVideo = async (req, res) => {
  try {
    const { id } = req.params
    const updates = req.body

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ error: 'No fields to update' })
    }

    const { data, error } = await supabase
      .from('videos')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return res.status(404).json({ error: 'Video not found' })
      }
      throw error
    }

    res.json(data)
  } catch (error) {
    console.error('Update video error:', error)
    res.status(400).json({ error: error.message || 'Failed to update video' })
  }
}

// DELETE video (ADMIN)
exports.deleteVideo = async (req, res) => {
  try {
    const { id } = req.params

    const { data, error } = await supabase
      .from('videos')
      .delete()
      .eq('id', id)
      .select('id')
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return res.status(404).json({ error: 'Video not found' })
      }
      throw error
    }

    res.json({ success: true })
  } catch (error) {
    console.error('Delete video error:', error)
    res.status(400).json({ error: error.message || 'Failed to delete video' })
  }
}