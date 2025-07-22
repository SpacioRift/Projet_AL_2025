
const Stat = require("../model/stat.model")
const Product = require("../model/product.model")
const Stock = require("../model/stock.model")
const Commande = require("../model/commande.model")
const { Op } = require("sequelize")

exports.create = async (req, res, next) => {
  const stat = await Stat.create(req.body.stat)
  res.status(201).json(stat)
}

exports.update = async (req, res, next) => {
  const stat = await Stat.update(
    {
      ...req.body.stat,
    },
    { where: { id: req.params.id } },
  )
  res.status(201).json(stat)
}

exports.delete = async (req, res, next) => {
  await Stat.destroy({ where: { id: req.params.id } })
  res.status(200).json({ message: "Statistique supprimée" })
}

exports.getById = async (req, res, next) => {
  const stat = await Stat.findOne({ where: { id: req.params.id } })
  res.status(200).json(stat)
}

exports.getAll = async (req, res, next) => {
  const statList = await Stat.findAll()
  res.status(200).json(statList)
}

// Nouvelles méthodes pour les statistiques

exports.getSummary = async (req, res, next) => {
  try {
    // Calculer les totaux d'entrées et sorties
    const totalEntries =
      (await Stat.sum("quantite_st", {
        where: {
          quantite_st: { [Op.gt]: 0 },
        },
      })) || 0

    const totalExits =
      (await Stat.sum("quantite_st", {
        where: {
          quantite_st: { [Op.lt]: 0 },
        },
      })) || 0

    // Compter le nombre de produits actifs
    const totalProducts = await Product.count()

    // Calculer la valeur totale du stock (simulation)
    const products = await Product.findAll()
    let totalValue = 0

    for (const product of products) {
      const stocks = await Stock.findAll({
        where: { produit_s: product.nom_p },
      })

      const totalQuantity = stocks.reduce((sum, stock) => sum + stock.quantite_s, 0)
      totalValue += totalQuantity * product.prix_p
    }

    res.status(200).json({
      totalEntries: Math.abs(totalEntries),
      totalExits: Math.abs(totalExits),
      totalProducts,
      totalValue: Math.round(totalValue),
    })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

exports.getEntriesExits = async (req, res, next) => {
  try {
    const { period, category } = req.query

    // Calculer la date de début selon la période
    const startDate = getStartDate(period)

    // Construire les conditions de filtrage
    const whereCondition = {
      date_st: { [Op.gte]: startDate },
    }

    // Récupérer les données par mois
    const stats = await Stat.findAll({
      where: whereCondition,
      order: [["date_st", "ASC"]],
    })

    // Grouper par mois et séparer entrées/sorties
    const monthlyData = groupByMonth(stats)

    res.status(200).json({
      entries: monthlyData.entries,
      exits: monthlyData.exits,
    })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

exports.getTopProducts = async (req, res, next) => {
  try {
    // Simuler des données pour les produits les plus vendus
    // En production, cela devrait être calculé à partir des commandes
    const products = await Product.findAll({ limit: 6 })

    const topProducts = products.map((product, index) => ({
      name: product.nom_p,
      sales: Math.floor(Math.random() * 50) + 10, // Simulation
    }))

    // Trier par ventes décroissantes
    topProducts.sort((a, b) => b.sales - a.sales)

    res.status(200).json(topProducts.slice(0, 6))
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

exports.getSalesEvolution = async (req, res, next) => {
  try {
    const { period } = req.query
    const startDate = getStartDate(period)

    const stats = await Stat.findAll({
      where: {
        date_st: { [Op.gte]: startDate },
        quantite_st: { [Op.lt]: 0 },
      },
      order: [["date_st", "ASC"]],
    })

    // Grouper par mois pour l'évolution
    const evolutionData = groupSalesByMonth(stats)

    res.status(200).json(evolutionData)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

// Fonctions utilitaires

function getStartDate(period) {
  const now = new Date()
  switch (period) {
    case "7j":
      return new Date(now.setDate(now.getDate() - 7))
    case "30j":
      return new Date(now.setDate(now.getDate() - 30))
    case "3m":
      return new Date(now.setMonth(now.getMonth() - 3))
    case "6m":
      return new Date(now.setMonth(now.getMonth() - 6))
    case "1a":
      return new Date(now.setFullYear(now.getFullYear() - 1))
    default:
      return new Date(now.setDate(now.getDate() - 30))
  }
}

function groupByMonth(stats) {
  const months = ["Jan", "Fév", "Mar", "Avr", "Mai", "Jun"]
  const entries = new Array(6).fill(0)
  const exits = new Array(6).fill(0)

  stats.forEach((stat) => {
    const monthIndex = new Date(stat.date_st).getMonth() % 6
    if (stat.quantite_st > 0) {
      entries[monthIndex] += stat.quantite_st
    } else {
      exits[monthIndex] += Math.abs(stat.quantite_st)
    }
  })

  return { entries, exits }
}

function groupSalesByMonth(stats) {
  const months = ["Jan", "Fév", "Mar", "Avr", "Mai", "Jun", "Jul", "Aoû", "Sep", "Oct", "Nov", "Déc"]
  const salesByMonth = new Array(12).fill(0)

  stats.forEach((stat) => {
    const monthIndex = new Date(stat.date_st).getMonth()
    salesByMonth[monthIndex] += Math.abs(stat.quantite_st)
  })

  return months.map((month, index) => ({
    month,
    sales: salesByMonth[index],
  }))
}
